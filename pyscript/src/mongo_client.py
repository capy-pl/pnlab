from os import getenv
from pymongo import MongoClient

MONGO_DB_NAME = getenv('MONGO_DB_NAME') or 'pn'
MONGO_PORT = getenv('MONGO_PORT') or 27017
MONGO_DB_ADDRESS = getenv('MONGO_DB_ADDRESS') or 'localhost'

if type(MONGO_PORT) is str:
    MONGO_PORT = int(MONGO_PORT)

mongo_client = MongoClient(MONGO_DB_ADDRESS, MONGO_PORT)
db = mongo_client[MONGO_DB_NAME]
