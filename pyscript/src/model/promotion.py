def is_in_time_range(start_time, end_time):
    def func(time):
        if time > start_time:
            return end_time > time
        return False
    return func


class Promotion:
    def __init__(self, promotion_dict):
        self.type = promotion_dict['type']
        self.group_one = promotion_dict['groupOne']
        if 'groupTwo' in promotion_dict:
            self.group_two = promotion_dict['groupTwo']
        self.is_in = is_in_time_range(
            promotion_dict['startTime'], promotion_dict['endTime'])
