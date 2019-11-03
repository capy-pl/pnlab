FROM python:3.7-slim-buster

ENV HOME /var
ENV MONGO_DB_ADDRESS pn-db
ENV RABBIT_MQ_ADDRESS pn-mq

ADD index.py /var/pnlab/
ADD requirements.txt /var/pnlab/
ADD pyscript /var/pnlab/pyscript/
ADD .env /var/pnlab/
ADD docker/scripts/docker-entrypoint-py.sh /bin/
ADD docker/scripts/wait-for-it.sh /bin/

WORKDIR /var/pnlab

RUN mkdir /var/pnlab/logs && \
    mkdir /var/pnlab/temp

RUN sed -i 's|MONGO_DB_ADDRESS=127.0.0.1|MONGO_DB_ADDRESS=pn-db|' .env && \
    sed -i 's|RABBIT_MQ_ADDRESS=127.0.0.1|RABBIT_MQ_ADDRESS=pn-mq|' .env

RUN chmod +x /bin/docker-entrypoint-py.sh && \
    chmod +x /bin/wait-for-it.sh

RUN apt-get -y update && \
    apt-get -y install build-essential libxml2-dev zlib1g-dev pkg-config libcairo-dev
RUN pip install -r requirements.txt

ENTRYPOINT [ "docker-entrypoint-py.sh" ]
