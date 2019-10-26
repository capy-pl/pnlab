from .logger import config_logger
from .task import network_analysis, import_from_histories, test_connection

import pika
import time
import logging
from bson.objectid import ObjectId
import sys
from datetime import datetime


def receive(action_id):
    from .mongo_client import db

    logging.info('Receive Action {}.'.format(action_id))

    if action_id == 'test':
        test_connection()
        return

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
        except:
            logging.exception('Not expected error.')

            db['actions'].update_one({
                '_id': ObjectId(action['_id'])
            }, {
                '$set': {
                    'status': 'error',
                    'modified': datetime.utcnow()
                }
            })


def callback(ch, method, properties, body: bytes):
    try:
        ch.basic_ack(delivery_tag=method.delivery_tag)
        msg = body.decode('utf-8')
        if msg:
            receive(msg)
    except Exception as err:
        logging.exception(err)


def main():
    while True:
        try:
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(host='localhost'))
            channel = connection.channel()
            channel.queue_declare(queue='pn', durable=True)
            config_logger()

            try:
                channel.basic_consume(queue='pn', on_message_callback=callback)
                channel.start_consuming()
            except KeyboardInterrupt:
                logging.info('Close python worker due to keyboard interrupt.')
                channel.stop_consuming()
                connection.close()
                break
        except pika.exceptions.ConnectionClosedByBroker as err:
            logging.error(err)
            logging.info(
                'Connection closed by broker. Retrying after 5 seconds.')
            time.sleep(5)
            continue

        except pika.exceptions.AMQPChannelError as err:
            logging.info('Channel closed. Stop the worker.')
            break

        except pika.exceptions.AMQPConnectionError as err:
            logging.error(err)
            logging.info('Connection error. Retrying after 5 seconds.')
            time.sleep(5)
            continue


def worker():
    main()
