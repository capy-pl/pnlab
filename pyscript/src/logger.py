import logging
import os
import pathlib

FORMAT = '[%(asctime)-15s] %(levelname)s %(message)s'

ROOT_PATH = os.getenv('HOME')

# TODO: May need to improve more. Current method will cause dirty write
# when multiple process's attempt to log at the same time.
def config_logger():
    logging.basicConfig(filename=os.path.join(ROOT_PATH, 'pnlab', 'logs', 'pn-python.log'),
                        level=logging.INFO, format=FORMAT)
