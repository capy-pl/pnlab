import logging

FORMAT = '[%(asctime)-15s] %(levelname)s %(message)s'


# TODO: May need to improve more. Current method will cause dirty
# when multiple process's attempt to log at the same time.
def config_logger():
    logging.basicConfig(filename='logs/pn-python.log',
                        level=logging.INFO, format=FORMAT)
