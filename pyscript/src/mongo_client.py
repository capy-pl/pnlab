from os import getenv
from pymongo import MongoClient
from dotenv import load_dotenv
load_dotenv()

MONGO_PORT = int(getenv('MONGO_PORT'))
MONGO_DB_NAME = getenv('MONGO_DB_NAME')

mongo_client = MongoClient('localhost', MONGO_PORT)
db = mongo_client[MONGO_DB_NAME]
