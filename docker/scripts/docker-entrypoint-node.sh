#!/bin/sh
wait-for-it.sh pn-db:27017 &
wait-for-it.sh pn-mq:5672 &
wait

pm2-runtime ${HOME}/pnlab/server/server.bundle.js
