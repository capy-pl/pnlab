#!/bin/sh
wait-for-it.sh -t 0 ${MONGO_DB_ADDRESS}:27017 &
wait-for-it.sh -t 0 ${RABBIT_MQ_ADDRESS}:5672 &
wait

python ${HOME}/pnlab/index.py
