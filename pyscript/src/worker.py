from .logger import config_logger
from .task import network_analysis, import_data
from .mongo_client import db

import pika
import time
import logging
from bson.objectid import ObjectId
import sys
from datetime import datetime


def receive(action_id):
    logging.info('Receive Action {}.'.format(action_id))
    action = db['actions'].find_one({
        '_id': ObjectId(action_id)
    })
    if not action:
        logging.error('Action {} not found.'.format(action_id))
    else:
        logging.info('Action {} found. type={} targetId={}.'
                     .format(action_id, action['type'], action['_id']))
        try:
            if action['type'] == 'report':
                network_analysis(action['targetId'])
            db['actions'].update_one({
                '_id': ObjectId(action['_id'])
            }, {
                '$set': {
                    'status': 'success',
                    'modified': datetime.utcnow()
                }
            })
        except Exception as err:
            db['actions'].update_one({
                '_id': ObjectId(action['_id'])
            }, {
                '$set': {
                    'status': 'error',
                    'modified': datetime.utcnow()
                }
            })


def main():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    channel.queue_declare(queue='pn', durable=True)
    config_logger()

    def callback(ch, method, properties, body: bytes):
        try:
            msg = body.decode('utf-8')
            receive(msg)
            ch.basic_ack(delivery_tag=method.delivery_tag)
        except Exception as err:
            logging.exception(err)

    channel.basic_consume(queue='pn', on_message_callback=callback)

    channel.start_consuming()


def worker():
    main()


if __name__ == "__main__":
    main()
