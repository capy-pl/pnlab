#!/bin/sh
wait-for-it.sh pn-db:27017 &
wait-for-it.sh pn-mq:5672 &
wait

python ${HOME}/pnlab/index.py
