FROM node:10-alpine

ENV NODE_ENV production

ADD dist/ /var/pnlab

WORKDIR /var/pnlab

RUN npm install --production
RUN npm install -g pm2

EXPOSE 3000

CMD ["pm2-runtime", "server/server.bundle.js"]
