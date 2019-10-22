from time import sleep
import pika


def test_connection():
    sleep(120)


def test_send_message():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    channel.basic_publish(exchange='',
                          routing_key='pn',
                          body='test')
    connection.close()
