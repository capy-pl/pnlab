FROM python:3.7

ADD index.py /var/pnlab
ADD requirements.txt /var/pnlab

ADD pyscripts /var/pnlab

WORKDIR /var/pnlab

RUN pip install -r requirements.txt

CMD [ "python", 'index.py']
