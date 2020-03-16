FROM python:3.7-slim-buster

ENV HOME /var

ADD index.py /var/pnlab/
ADD requirements.txt /var/pnlab/
ADD pyscript /var/pnlab/pyscript/
ADD .env /var/pnlab/
ADD docker/scripts/docker-entrypoint-py.sh /bin/
ADD docker/scripts/wait-for-it.sh /bin/

WORKDIR /var/pnlab

RUN mkdir /var/pnlab/logs
RUN mkdir /var/pnlab/temp

RUN chmod +x /bin/docker-entrypoint-py.sh
RUN chmod +x /bin/wait-for-it.sh

RUN apt-get -y update
RUN apt-get -y install build-essential libxml2-dev zlib1g-dev pkg-config libcairo-dev

RUN pip install -r requirements.txt

ENTRYPOINT [ "docker-entrypoint-py.sh" ]
