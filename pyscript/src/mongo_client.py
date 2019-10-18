from os import getenv
from pymongo import MongoClient

MONGO_PORT = int(getenv('MONGO_PORT')) or '27017'
MONGO_DB_NAME = getenv('MONGO_DB_NAME') or 'pn'
MONGO_DB_ADDRESS = getenv('MONGO_DB_ADDRESS') or 'localhost'

mongo_client = MongoClient(MONGO_DB_ADDRESS, MONGO_PORT)
db = mongo_client[MONGO_DB_NAME]
