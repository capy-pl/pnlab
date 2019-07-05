import os
from pyscript.src import worker
from multiprocessing.pool import Pool

def main():
    # No need for that much processes. It will cost lots memory.
    # worker_number = os.cpu_count()
    worker_number = 2
    worker_pool = Pool(worker_number)

    for _ in range(worker_number):
        worker_pool.apply_async(worker, [])

    worker_pool.close()
    print('[*] Waiting for incoming messages.', flush=True)
    worker_pool.join()

if __name__ == '__main__':
    main()
