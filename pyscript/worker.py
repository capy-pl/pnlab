import pika
import time

def worker():
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    channel.queue_declare(queue='hello', durable=True)
    def callback(ch, method, properties, body: bytes):
        msg = body.decode('utf-8')
        print(" [x] Received %r" % msg)
        time.sleep(msg.count('.'))
        print(' [x] Done')
        ch.basic_ack(delivery_tag=method.delivery_tag)

    channel.basic_consume(queue='hello', on_message_callback=callback)

    print(' [*] Waiting for incoming messages.')

    channel.start_consuming()
