from os import getenv, path
from bson.objectid import ObjectId
import traceback
from datetime import datetime
import logging
import traceback
from pymongo.errors import BulkWriteError

from ..mongo_client import db
from ..utils import bigger_than_256mb
from ..preprocessing import TransactionCSVReader, TransactionEncoder


def import_from_histories(history_id):
    import_history = db['importHistories'].find_one(
        {'_id': ObjectId(history_id)})
    try:
        file_path = path.join(
            import_history['filepath'], import_history['filename'])
        transaction_nums, item_nums = import_from_file_path(file_path)
        success_update = {
            'type': 'success',
            'modified': datetime.utcnow(),
            'transactionNum': transaction_nums,
            'itemNum': item_nums
        }
        db['importHistories'].update_one({
            '_id': ObjectId(history_id)
        }, {
            '$set': success_update
        })
    except Exception as err:
        logging.error(err)
        error_update = {
            'type': 'error',
            'errMessage': traceback.format_exc(),
            'modified': datetime.utcnow()
        }
        db['importHistories'].update_one({
            '_id': ObjectId(history_id)
        }, {
            '$set': error_update
        })


def import_from_file_path(file_path):
    org_data = db['orgs'].find_one()
    org_schema = org_data['importSchema']
    reader = TransactionCSVReader(org_schema)
    transformer = TransactionEncoder(org_schema)
    records = {
        'transaction_num': 0,
        'item_num': 0
    }

    if bigger_than_256mb(file_path):
        logging.info(
            '{} is larger than 256MB. It will be processed by chunk.'.format(file_path))
        print('{} is larger than 256MB. It will be processed by chunk.'.format(
            file_path), flush=True)
        chunks = reader.read_csv_by_chunk(file_path, 1000000)
        for transactions, items in transformer.transform_by_chunk(chunks):
            records['transaction_num'] += len(transactions)
            update_schema(org_schema['itemFields'], items)
            update_schema(org_schema['transactionFields'], transactions)
            try:
                db.transactions.insert_many(transactions)
                db.items.insert_many(items)
                print('{} transactions processed.'.format(
                    len(transactions)), flush=True)
                logging.info(
                    '{} transactions processed.'.format(len(transactions)))
            except BulkWriteError:
                pass

    else:
        df = reader.read_csv(file_path)
        transactions, items = transformer.transform(df)
        records['transaction_num'] = len(transactions)
        update_schema(org_schema['itemFields'], items)
        update_schema(org_schema['transactionFields'], transactions)
        try:
            db.transactions.insert_many(transactions)
            db.items.insert_many(items)
            print('{} transactions processed.'.format(
                len(transactions)), flush=True)
            logging.info(
                '{} transactions processed.'.format(len(transactions)))
        except BulkWriteError:
            pass
    db['orgs'].update_one({
        '_id': org_data['_id']
    },
        {
        '$set': {
            'importSchema': org_schema
        }
    })
    logging.info('Db schema updated.')
    print('Db schema updated.')
    return tuple(records.values())


def update_schema(fields, items):
    field_value_dict = {}
    for field in fields:
        if field['type'] == 'string':
            field_value_dict[field['name']] = set(field['values'])
        if field['type'] == 'date':
            field_value_dict[field['name']] = list(field['values'])

    for item in items:
        for field in fields:
            field_name = field['name']
            if field_name in item:
                if field['type'] == 'string' and item[field_name] not in field_value_dict[field_name]:
                    field_value_dict[field_name].add(item[field_name])
                if field['type'] == 'date':
                    if len(field_value_dict[field_name]) == 0:
                        field_value_dict[field_name] = [
                            item[field_name].to_pydatetime(), item[field_name].to_pydatetime()]
                    else:
                        if item[field_name].to_pydatetime() < field_value_dict[field_name][0]:
                            field_value_dict[field_name][0] = item[field_name].to_pydatetime(
                            )
                        if item[field_name].to_pydatetime() > field_value_dict[field_name][1]:
                            field_value_dict[field_name][1] = item[field_name].to_pydatetime(
                            )

    for field in fields:
        if field['type'] == 'string':
            field['values'] = list(field_value_dict[field['name']])
        if field['type'] == 'date':
            field['values'] = field_value_dict[field['name']]
