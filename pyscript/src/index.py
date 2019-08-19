from os import getenv
from pymongo import MongoClient
from bson.objectid import ObjectId
import traceback
from datetime import datetime
from dotenv import load_dotenv

from .preprocessor import NetworkConverter
from .utils import to_query, to_datetime, extract_promotion, extract_method
from .error import ZeroTransactionError, ZeroNodeError

load_dotenv()

MONGO_PORT = int(getenv('MONGO_PORT'))
MONGO_DB_NAME = getenv('MONGO_DB_NAME')

client = MongoClient('localhost', MONGO_PORT)
db = client[MONGO_DB_NAME]


def network_analysis(report_id):
    report = db['reports'].find_one({'_id': ObjectId(report_id)})
    if not report:
        return
    try:
        query = to_query(report['conditions'])
        method = extract_method(report['conditions'])
        promotions = extract_promotion(report['conditions'])
        purchase_list = list(db['transactions'].find(
            query, projection=['items', '資料日期與時間']))
        promotions = list(db['promotions'].find({'name': {'$in': promotions}}))
        if len(purchase_list) <= 0:
            raise ZeroTransactionError('No transactions match the conditions.')
        converter = NetworkConverter(purchase_list, method=method)
        converter.add_promotion_filters(promotions)
        converter.done()
        product_network = converter.transform()
        data = product_network.to_document()
        update_expr = {
            'communities': data['communities'],
            'nodes': data['nodes'],
            'edges': data['edges'],
            'status': 'success',
            'rank': data['rank'],
            'hooks': data['hooks'],
            'modified': datetime.utcnow(),
            'errMessage': '',
        }
        db['reports'].update_one({'_id': ObjectId(report_id)}, {
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
