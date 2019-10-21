import os
from multiprocessing.pool import Pool
import logging
from time import sleep

from .src import worker
from .src.logger import config_logger


def main():
    # No need for that much processes. It will cost lots memory.
    worker_number = os.cpu_count()
    # worker_number = 2
    config_logger()

    while True:
        with Pool(worker_number) as pool:
            for _ in range(worker_number):
                pool.apply_async(worker, [])

            pool.close()
            print('Python services started.', flush=True)
            logging.info('Python services started.')

            try:
                pool.join()
            except KeyboardInterrupt:
                logging.info('Close Python services due to KeyboardInterrupt.')
                print('Close Python services due to KeyboardInterrupt.')
                break
            except:
                logging.info(
                    'Program exit unexpected. Will restart services in 5 seconds.')
                sleep(5)


if __name__ == '__main__':
    main()
