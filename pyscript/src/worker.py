from .mongo_client import db
from .task import network_analysis, import_from_histories
from .logger import config_logger
import pika
import time
import logging
from bson.objectid import ObjectId
import sys
from datetime import datetime
from dotenv import load_dotenv
from os import getenv

load_dotenv()


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
            if action['type'] == 'import':
                import_from_histories(action['targetId'])

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
        pika.ConnectionParameters(getenv('RABBIT_MQ_ADDRESS' or 'localhost')))
    channel = connection.channel()
    channel.queue_declare(queue='pn', durable=True)
    config_logger()

    def callback(ch, method, properties, body: bytes):
        try:
            msg = body.decode('utf-8')
            if msg:
                ch.basic_ack(delivery_tag=method.delivery_tag)
                receive(msg)
        except Exception as err:
            ch.basic_ack(delivery_tag=method.delivery_tag)
            logging.exception(err)

    channel.basic_consume(queue='pn', on_message_callback=callback)

    channel.start_consuming()


def worker():
    load_dotenv()
    main()


if __name__ == "__main__":
    main()
