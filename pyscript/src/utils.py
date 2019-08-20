from datetime import datetime


def to_datetime(string):
    return datetime.strptime(string, '%Y-%m-%dT%H:%M:%S.000Z')


def to_query(conditions):
    default_query = {
        'items.1': {
            '$exists': True
        }
    }
    item_query = {
    }
    for condition in conditions:
        if condition['type'] == 'string':
            if len(condition['values']) > 0:
                if condition['belong'] == 'transaction':
                    default_query[condition['name']] = {
                        '$in': condition['values']
                    }
                if condition['belong'] == 'item':
                    item_query[condition['name']] = {
                        '$in': condition['values']
                    }
        if condition['type'] == 'date':
            if len(condition['values']) > 0:
                if len(condition['values']) == 2:
                    min_time = to_datetime(condition['values'][0])
                    max_time = to_datetime(condition['values'][1])
                    default_query[condition['name']] = {
                        '$lte': max_time,
                        '$gte': min_time
                    }
                else:
                    raise ValueError(
                        'Date condition should contain a max and a min value.')
        if len(item_query.keys()) > 0:
            default_query['items'] = {
                '$elemMatch': item_query
            }
    return default_query


def extract_promotion(conditions):
    for condition in conditions:
        if condition['type'] == 'promotion':
            return condition['values']
    return []


def extract_method(conditions) -> str:
    for condition in conditions:
        if condition['type'] == 'method':
            return condition['values'][0]
    return 'frequency'
