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
    promotions = []
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
                    a = to_datetime(condition['values'])
                    b = to_datetime(condition['values'])
                    max_time = a if a > b else b
                    min_time = b if a > b else a
                    default_query[condition['name']] = {
                        '$lte': max_time,
                        '$gte': min_time
                    }
                else:
                    raise ValueError('Date condition should contain a max and a min value.')
        if condition['type'] == 'promotion':
            for promotion in condition['values']:
                promotions.append(promotion)
        if len(item_query.keys()) > 0:
            default_query['items'] = {
                '$elemMatch': item_query
            }
    return default_query, promotions
