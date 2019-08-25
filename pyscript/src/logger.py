import logging

FORMAT = '[%(asctime)-15s] %(levelname)s %(message)s'


def config_logger():
    logging.basicConfig(filename='logs/pn-python.log',
                        level=logging.INFO, format=FORMAT)
