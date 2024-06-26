import configparser
import time
import os
import random
from datetime import datetime, timedelta
from selenium import webdriver
from selenium.webdriver.common.by import By
import requests 
# Set up the WebDriver for Chrome

config = configparser.ConfigParser()
config.read('config.ini')


# Log file name
log_file_name = "logfile.log"
# Get the current directory where the script is running
current_directory = os.getcwd()
# Combine the current directory with the log file name
log_file_path = os.path.join(current_directory, log_file_name)


# Current timestamp
now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
hour_str = now.split(' ')[1].split(':')[0] 

# Write to the log file
with open(log_file_path, "a") as file:
    file.write(f"{now} - Script was run\n")

driver = webdriver.Chrome()

# Retrieve credentials
username = config.get('credentials', 'username')
password = config.get('credentials', 'password')

urlLogin = config.get('credentials', 'urlLogin')
email = config.get('credentials', 'email')
senha = config.get('credentials', 'senha')
averageTimefixed = config.get('credentials', 'averageTime')
# Open a web page (for example, Google)
driver.get("https://intranet.acpgroup.com.br/ControleAcesso/Seguranca/Login?ReturnUrl=%2fhoras")
time.sleep(2)

# perform actions group 

def perform_actions(driver, averageTime): #time in secods
    timetosleep = calculateTimeToClick(averageTime)
    time.sleep(timetosleep)
    make_login(driver)
    click_submit_button(driver)
    time.sleep(5)

def perform_actions2e3(driver): 
    make_login(driver)
    click_submit_button(driver)
    time.sleep(5)

def perform_actions4(driver): 
    make_login(driver)
    value = get_value_after_login(driver)

    timetosleep=calculateAwaitToClick(value)
    time.sleep(timetosleep)

    click_submit_button(driver)
    time.sleep(5)

# api function groups 

def fetch_data_from_api(url,token):
    headers = {'Authorization': token}
    response = requests.get(url, headers=headers)
    data = response.json()
    return data

def authenticate_and_get_token():
    url = urlLogin
    headers = {"Content-Type": "application/json"}
    data = {"email": email, "senha": senha }
    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 200:
        # Extract the token from the response header
        token = response.headers.get('Authorization')
        return token
    else:
        raise Exception("Authentication failed")

# functions of low order groups 
def calculateAwaitToClick(value):
    # Get the current time
    current_time = datetime.now()
    
    new_time = current_time + timedelta(minutes=value)
    
    time_difference = new_time - current_time

    return int(time_difference.total_seconds())

def get_value_after_login(driver):
    
    time.sleep(5)

    table = driver.find_element(By.CLASS_NAME, "turno")

    rows = table.find_elements(By.TAG_NAME, "tr")

    for row in rows:

        cells = row.find_elements(By.TAG_NAME, "td")

        if cells:
            cell_text = cells[0].text.strip() 

            try:
                minutes = int(cell_text.split(':')[1])
                return minutes
            except IndexError as e:
                print(f"Error processing time data: {e}")
                continue 
        else:
            print("No cells found in this row.")
            continue

    return None

def process_data_fetched(settings):
    reference_time_str = '08:00:00'# see if is what i want
    reference_time = datetime.strptime(reference_time_str, '%H:%M:%S')

    for setting in settings:
        if setting['type'] == 'time1' and setting['status']:
            time_value = setting['overrideTime'] if setting['overrideTime'] else setting['defaultTime']
            time_value_dt = datetime.strptime(time_value, '%H:%M:%S')

            time_difference = time_value_dt - reference_time
            minutes_difference = int(time_difference.total_seconds() / 60)

            return minutes_difference
        
    return None

def process_data_fetched2(settings,myType):

    for setting in settings:
        if setting['type'] == myType and setting['status']:

            return True
        
    return None

def click_submit_button(driver):
    password_field2 = driver.find_element(By.ID, "btn-registrar") 
    password_field2.click()
    time.sleep(5)
    success = driver.save_screenshot('screenshot1.png')

def calculateTimeToClick(average):
    average_in_seconds = average * 60
    random_variation = random.uniform(0, 15) * 60
    total_time = average_in_seconds + random_variation
    return total_time

def make_login(driver):
    
    password_field = driver.find_element(By.ID, "Pass2") 
    password_field.send_keys(password)
    time.sleep(2)
    
    username_field = driver.find_element(By.NAME, "Login")  
    username_field.send_keys(username)
    time.sleep(2)
    
    login_button = driver.find_element(By.XPATH, '//button[@type="submit"]')  
    login_button.click()
    time.sleep(5)

# make ponto function groups 

def makeponto4(our_str):

    if our_str == '17':
        vtype='time4'

    try:
        token = authenticate_and_get_token()  # Authenticate and retrieve token
        url = "http://localhost:8080/api/records/settings"    
        data_fetched = fetch_data_from_api(url, token)
        averageTime = process_data_fetched2(data_fetched,vtype)

        if averageTime:
            perform_actions4(driver)

    except requests.exceptions.RequestException as e:
        print(f"API is not reachable, using default settings: {e}")
       
        if averageTime:
            perform_actions4(driver)

    except Exception as e:
        print(e)

    finally:
        driver.quit()

def makeponto2e3(our_str):
    if our_str == '12':
        vtype='time2'
    else:
        vtype='time3'

    try:
        token = authenticate_and_get_token()  # Authenticate and retrieve token
        url = "http://localhost:8080/api/records/settings"    
        data_fetched = fetch_data_from_api(url, token)
        averageTime = process_data_fetched2(data_fetched,vtype)

        if averageTime:
            perform_actions2e3(driver)

    except requests.exceptions.RequestException as e:
        print(f"API is not reachable, using default settings: {e}")

        if averageTime:
            perform_actions2e3(driver)

    except Exception as e:
        print(e)

    finally:
        driver.quit()

def makeponto1():
    try:
        token = authenticate_and_get_token()  # Authenticate and retrieve token
        url = "http://localhost:8080/api/records/settings"    
        data_fetched = fetch_data_from_api(url, token)
        averageTime = process_data_fetched(data_fetched)

        if averageTime:
            perform_actions(driver, averageTime)

    except requests.exceptions.RequestException as e:
        print(f"API is not reachable, using default settings: {e}")
        averageTime = int(averageTimefixed)
        if averageTime:
            perform_actions(driver, averageTime)

    except Exception as e:
        print(e)

    finally:
        driver.quit()

# main functio groups 

def main(driver):
    hour_strt = '17'
    makeponto4(hour_strt)


    if hour_str == '08':
        makeponto1()
    elif hour_str == '12' or hour_str == '13':
        makeponto2e3(hour_str)
    elif hour_str == '17':
        makeponto4(hour_str)
    else:
        print("It's not the time for any scheduled tasks.")

if __name__ == "__main__":
    main(driver)


