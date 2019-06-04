import os
from worker import worker
from multiprocessing.pool import Pool


def main():
    worker_number = os.cpu_count()
    worker_pool = Pool(worker_number)

    for _ in range(worker_number):
        worker_pool.apply_async(worker, [])

    worker_pool.close()

    try:
        while True:
            continue
    except KeyboardInterrupt:
        print(' [*] Exiting')
        worker_pool.terminate()
        worker_pool.join() 

if __name__ == '__main__':
    main()
