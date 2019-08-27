import numpy
from pandas import read_csv


class TransactionCSVReader:
    def __init__(self, schema):
        self.schema = schema

    def to_options(self):
        pd_init = {
            'USE_COLUMNS': [],
            'PARSE_DATES': [],
            'INDEX_COLUMN': 0,
        }
        pd_init['INDEX_COLUMN'] = self.schema['transactionName']
        pd_init['USE_COLUMNS'].append(self.schema['transactionName'])
        pd_init['USE_COLUMNS'].append(self.schema['itemName'])
        pd_init['USE_COLUMNS'].append(self.schema['amountName'])
        for attr in self.schema['transactionFields']:
            if attr['type'] == 'date':
                pd_init['PARSE_DATES'].append(attr['name'])
            pd_init['USE_COLUMNS'].append(attr['name'])
        for attr in self.schema['itemFields']:
            pd_init['USE_COLUMNS'].append(attr['name'])
        return pd_init

    def to_dtype(self):
        dtype = {}
        dtype[self.schema['transactionName']] = numpy.str
        dtype[self.schema['itemName']] = numpy.str
        dtype[self.schema['amountName']] = numpy.float64

        for attr in self.schema['transactionFields']:
            dtype[attr['name']] = self.get_type(attr['type'])

        for attr in self.schema['itemFields']:
            dtype[attr['name']] = self.get_type(attr['type'])
        return dtype

    def get_type(self, _type):
        if _type == 'string':
            return numpy.str
        if _type == 'int':
            return numpy.float64
        if _type == 'float':
            return numpy.float64
        if _type == 'date':
            return numpy.str

    def read_csv(self, file_path):
        options = self.to_options()
        dtype = self.to_dtype()
        return read_csv(file_path,
                        dtype=dtype,
                        index_col=options['INDEX_COLUMN'],
                        usecols=options['USE_COLUMNS'],
                        parse_dates=options['PARSE_DATES'],
                        )
