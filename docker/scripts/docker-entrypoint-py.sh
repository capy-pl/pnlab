#!/bin/sh
wait-for-it.sh -t 0 pn-db:27017 &
wait-for-it.sh -t 0 pn-mq:5672 &
wait

python ${HOME}/pnlab/index.py
