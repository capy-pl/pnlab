FROM node:10-alpine

ENV NODE_ENV production
ENV HOME /var

ADD dist/ /var/pnlab/
ADD .env /var/pnlab/
ADD package.json /var/pnlab/

WORKDIR /var/pnlab

RUN sed -i 's|MONGO_DB_ADDRESS=127.0.0.1|MONGO_DB_ADDRESS=pn-db|' .env 
RUN sed -i 's|RABBIT_MQ_ADDRESS=127.0.0.1|RABBIT_MQ_ADDRESS=pn-mq|' .env 

RUN yarn install --production
RUN yarn global add pm2

EXPOSE 3000

CMD ["pm2-runtime", "server/server.bundle.js"]
