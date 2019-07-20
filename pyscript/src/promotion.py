def is_in_time_range(start_time, end_time):
    def func(time):
        if time > start_time:
            return end_time > time
        return False
    return func

class Promotion:
    def __init__(self, group_one, group_two, start_time, end_time):
        self.group_one = group_one
        self.group_two = group_two
        self.is_in = is_in_time_range(start_time, end_time)
