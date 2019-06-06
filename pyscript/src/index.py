from pymongo import MongoClient
from bson.objectid import ObjectId
import traceback
from datetime import datetime

from .product_network import NetworkConverter, ProductNerwork
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
        purchase_list = list(db['transactions'].find(query, projection=['items']))
        if len(purchase_list) <= 0:
            raise ZeroTransactionError('No transactions match the conditions.')
        converter = NetworkConverter(purchase_list)
        product_network = converter.convert()
        data = product_network.to_document()
        update_expr = {
            'nodes': data['nodes'],
            'edges': data['edges'],
            'status': 'success',
            'modified': datetime.now(),
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
            'modified': datetime.now()
        }
        db['reports'].update_one({
            '_id': ObjectId(report_id)
        }, {
            '$set': error_update
        })
        return