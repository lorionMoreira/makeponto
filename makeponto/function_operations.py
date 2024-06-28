import random
from datetime import datetime, timedelta

def process_data_fetched(settings):

    for setting in settings:
        if setting['type'] == 'time1' and setting['status']:
            time_value = setting['overrideTime'] if setting['overrideTime'] else setting['defaultTime']


            return time_value
        
    return None

def process_status_ponto(settings,myType):

    for setting in settings:
        if setting['type'] == myType and setting['status']:

            return True
        
    return None

def calculateAwaitToClick(value):
    # Get the current time
    current_time = datetime.now()
    
    new_time = current_time + timedelta(minutes=value)
    
    time_difference = new_time - current_time

    return int(time_difference.total_seconds())





def calculateTimeToClick(timeDefined):
    time_value_dt = datetime.strptime(timeDefined, '%H:%M:%S')

    reference_time_str = '08:00:00'# see if is what i want
    reference_time = datetime.strptime(reference_time_str, '%H:%M:%S')


    time_difference = time_value_dt - reference_time

    minutes_difference = int(time_difference.total_seconds() / 60)
    seconds_difference = minutes_difference * 60

    random_variation = random.uniform(0, 15) * 60

    total_time = seconds_difference + random_variation

    return total_time
