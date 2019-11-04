from os import getenv
from pymongo import MongoClient
from dotenv import load_dotenv
import logging

load_dotenv()

MONGO_DB_NAME = getenv('MONGO_DB_NAME') or 'pn'
MONGO_PORT = getenv('MONGO_PORT') or 27017
MONGO_DB_ADDRESS = getenv('MONGO_DB_ADDRESS') or 'localhost'
MONGO_DB_USER = getenv('MONGO_DB_USER')
MONGO_DB_PASS = getenv('MONGO_DB_PASS')

if type(MONGO_PORT) is str:
    MONGO_PORT = int(MONGO_PORT)

mongo_client = MongoClient(
    MONGO_DB_ADDRESS, MONGO_PORT,
    authSource='pn',
    username=MONGO_DB_USER,
    password=MONGO_DB_PASS)

db = mongo_client[MONGO_DB_NAME]
