FROM node:12-alpine

ENV NODE_ENV production
ENV HOME /var

ADD dist/ /var/pnlab/
ADD .env /var/pnlab/
ADD package.json /var/pnlab/
ADD ecosystem.config.js /var/pnlab/
ADD docker/scripts/docker-entrypoint-node.sh /bin/
ADD docker/scripts/wait-for-it.sh /bin/

WORKDIR /var/pnlab

RUN sed -i 's|MONGO_DB_ADDRESS=127.0.0.1|MONGO_DB_ADDRESS=pn-db|' .env && \
    sed -i 's|RABBIT_MQ_ADDRESS=127.0.0.1|RABBIT_MQ_ADDRESS=pn-mq|' .env
RUN chmod +x /bin/docker-entrypoint-node.sh && \
    chmod +x /bin/wait-for-it.sh
RUN apk add bash
RUN yarn install --production
RUN yarn global add pm2

EXPOSE 3000

ENTRYPOINT [ "docker-entrypoint-node.sh" ]
