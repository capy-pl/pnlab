import pandas as pd
import numpy
from pymongo import MongoClient

from lib import TransactionTransformer

client = MongoClient('localhost', 27017)
db = client['pn']

print('Connected to Mongodb.')

DEFAULT_SCHEMA = {
    '交易id': numpy.str,
    '資料日期': numpy.str,
    '資料時間': numpy.str,
    '餐別帶': numpy.str,
    '縣市別': numpy.str,
    '店舖代號': numpy.uint32,
    '主商圈': numpy.str,
    '品號-品名稱': numpy.str,
    '群號-群名稱': numpy.str,
    '單品名稱': numpy.str,
    '銷售數量': numpy.uint16,
    '銷售單價': numpy.float,
    '交易金額': numpy.float
}

USE_COLUMNS = ['交易id', '資料日期', '資料時間', '餐別帶', '縣市別', '店舖代號', '主商圈', '品號-品名稱',
       '群號-群名稱', '單品名稱', '銷售數量', '銷售單價', '交易金額']

PARSE_DATES = {
    '資料日期與時間': [
        '資料日期',
        '資料時間'
    ]
}

TRANSACTION_ATTRS =  ['餐別帶', '資料日期與時間', '縣市別', '店舖代號', '主商圈']
ITEM_ATTRS = ['品號-品名稱', '群號-群名稱', '銷售單價']

datas = pd.read_csv('customer_data.csv',
                   index_col=1,
                   nrows=50000,
                   usecols=USE_COLUMNS,
                   dtype=DEFAULT_SCHEMA,
                   parse_dates=PARSE_DATES,
        )
print('Read CSV data.')

transformer = TransactionTransformer('交易id', '單品名稱', '交易金額', TRANSACTION_ATTRS, ITEM_ATTRS)
transactions = transformer.transform(datas)
ids = db.transactions.insert_many(transactions)
print('Import completed.')
