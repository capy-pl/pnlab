from os import getenv
from bson.objectid import ObjectId
import traceback
from datetime import datetime
import logging

from ..preprocessing import TransactionTransformer
from ..utils import to_query, to_datetime, extract_promotion, extract_method
from ..error import ZeroTransactionError, ZeroNodeError
from ..mongo_client import db


def network_analysis(report_id):
    logging.info('Start processing Report {}.'.format(report_id))
    report = db['reports'].find_one({'_id': ObjectId(report_id)})
    org_data = db['orgs'].find_one()
    if not report:
        return
    try:
        query = to_query(report['conditions'])
        method = extract_method(report['conditions'])
        promotions = extract_promotion(report['conditions'])
        org_schema = org_data['importSchema']
        purchase_list = list(db['transactions'].find(
            query, projection=['items', org_schema['transactionTime']]))
        promotions = list(db['promotions'].find({'name': {'$in': promotions}}))
        if len(purchase_list) <= 0:
            raise ZeroTransactionError('No transactions match the conditions.')
        converter = TransactionTransformer(
            purchase_list, org_schema, method=method)
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
    except ZeroTransactionError:
        logging.exception('No transaction matchs the query.')
        err_message = '沒有符合的交易資料。'
    except ZeroNodeError:
        logging.exception('No node exists after filtering.')
        err_message = '篩選後沒有商品進入網路資料。'
    except:
        logging.exception('Unexpected error.')
        err_message = '非預期的錯誤。'

    error_update = {
        'status': 'error',
        'errMessage': err_message,
        'modified': datetime.utcnow()
    }

    db['reports'].update_one({
        '_id': ObjectId(report_id)
    }, {
        '$set': error_update
    })
