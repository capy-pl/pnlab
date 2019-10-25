FROM python:3.7

ADD index.py /var/pnlab
ADD requirements.txt /var/pnlab

ADD pyscripts /var/pnlab

WORKDIR /var/pnlab

RUN pip install -r requirements.txt
RUN mkdir ~/pnlab\
    && mkdir ~/pnlab/logs\
    && mkdir ~/pnlab/temp

CMD [ "python", 'index.py']
