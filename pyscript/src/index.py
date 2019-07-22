from pymongo import MongoClient
from bson.objectid import ObjectId
import traceback
from datetime import datetime

from .preprocessor import NetworkConverter
from .utils import to_query, to_datetime
from .error import ZeroTransactionError

client = MongoClient('localhost', 27017)
db = client['pn']

def network_analysis(report_id):
    report = db['reports'].find_one({ '_id': ObjectId(report_id) })
    if not report:
        return
    try:
        query = to_query(report['conditions'])
        purchase_list = list(db['transactions'].find(query, projection=['items', '資料日期與時間']))
        if len(purchase_list) <= 0:
            raise ZeroTransactionError('No transactions match the conditions.')
        converter = NetworkConverter(purchase_list)
        converter.done()
        product_network = converter.transform()
        data = product_network.to_document()
        update_expr = {
            'communities': data['communities'],
            'nodes': data['nodes'],
            'edges': data['edges'],
            'status': 'success',
            'modified': datetime.utcnow(),
            'errMessage': '',
        }
        db['reports'].update_one({ '_id': ObjectId(report_id)}, {
            '$set': update_expr
        })
        return
    except Exception:
        traceback.print_exc()
        error_update = {
            'status': 'error',
            'errMessage': traceback.format_exc(),
            'modified': datetime.utcnow()
        }
        db['reports'].update_one({
            '_id': ObjectId(report_id)
        }, {
            '$set': error_update
        })
        return
