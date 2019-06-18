import pika
import time
from .src import network_analysis

def worker():
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    channel.queue_declare(queue='pn', durable=True)
    def callback(ch, method, properties, body: bytes):
        msg = body.decode('utf-8')
        print(' [*] Start to analysis Report: {}'.format(msg))
        network_analysis(msg)
        ch.basic_ack(delivery_tag=method.delivery_tag)

    channel.basic_consume(queue='pn', on_message_callback=callback)

    print(' [*] Waiting for incoming messages.')

    channel.start_consuming()
