FROM mongo:latest

COPY docker/scripts/init-mongo.js /docker-entrypoint-initdb.d/