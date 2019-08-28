from os import getenv
from bson.objectid import ObjectId
import traceback
from datetime import datetime
import logging

from ..mongo_client import db


def import_data(data_id):
    import_history = db['importHistories'].find_one({'_id': ObjectId(data_id)})
    file_path = import_history['filepath'] + import_history['filename']
