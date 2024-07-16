import configparser
import time
import os
import random
import logging
from datetime import datetime, timedelta
from selenium import webdriver
from selenium.webdriver.common.by import By
import requests 
from function_operations import process_data_fetched, process_status_ponto, calculateAwaitToClick, calculateTimeToClick
# Set up the WebDriver for Chrome

config = configparser.ConfigParser()
config.read('config.ini')

# Configure logging
logging.basicConfig(filename='automation.log', filemode='a', level=logging.DEBUG,
                    format='%(asctime)s - %(levelname)s - %(message)s')

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

linkLoginPonto = config.get('credentials', 'linkLoginPonto')
loginEndpoint = config.get('credentials', 'urlLogin')
urlSetting = config.get('credentials', 'urlSetting')

email = config.get('credentials', 'email')
senha = config.get('credentials', 'senha')
definedTimefixed = config.get('credentials', 'definedTime')

isProd = config.get('credentials', 'isProd')

#get ambient to comunicate
if isProd == 'yes':  # Replace this condition with something that determines dev vs. prod
    baseUrl = config.get('credentials', 'urlBaseProd')
else:
    baseUrl = config.get('credentials', 'urlBaseDev')

# Open a web page (for example, Google)
driver.get(linkLoginPonto)
time.sleep(2)

# perform actions group 

def perform_actions(driver, averageTime): #time in secods
    timetosleep = calculateTimeToClick(averageTime)
    logging.debug(f'time to sleep of performed actions {timetosleep}')
    time.sleep(timetosleep)
    make_login(driver)
    click_submit_button(driver)
    time.sleep(5)

def perform_actions2e3(driver): 
    logging.debug(f'perform actions 2e3 ')
    make_login(driver)
    click_submit_button(driver)
    time.sleep(5)

def perform_actions4(driver): 
    logging.debug(f'perform actions 4 ')
    make_login(driver)
    value = get_value_after_login(driver)

    timetosleep=calculateAwaitToClick(value)
    time.sleep(timetosleep)

    click_submit_button(driver)
    time.sleep(5)

# api function groups 

def fetch_data_from_api(url,token): #must be authenticated
    headers = {'Authorization': token}
    response = requests.get(url, headers=headers)
    data = response.json()
    return data

def authenticate_and_get_token():
    url = baseUrl + loginEndpoint
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


# action selenium functions 

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
def click_submit_button(driver):
    try:
        password_field2 = driver.find_element(By.ID, "btn-registrar") 
        password_field2.click()
        time.sleep(5)
        success = driver.save_screenshot('screenshot1.png')
        logging.debug(f'click submit went well')
    except Exception as e:
        logging.error(f'Error in click sumbit: {e}')
    finally:
        time.sleep(5)

def make_login(driver):
    try:
        password_field = driver.find_element(By.ID, "Pass2") 
        password_field.send_keys(password)
        time.sleep(2)
        
        username_field = driver.find_element(By.NAME, "Login")  
        username_field.send_keys(username)
        time.sleep(2)
        
        login_button = driver.find_element(By.XPATH, '//button[@type="submit"]')  
        login_button.click()
        logging.debug(f'makelogin went well')
    except Exception as e:
        logging.error(f'Error in make_login: {e}')
    finally:
        time.sleep(5)
# make ponto function groups 

def makeponto4(our_str):

    if our_str == '17':
        vtype='time4'

    try:
        token = authenticate_and_get_token()  # Authenticate and retrieve token
        url = baseUrl+urlSetting    
        data_fetched = fetch_data_from_api(url, token)
        statusPonto = process_status_ponto(data_fetched,vtype)

        if statusPonto:
            logging.debug(f'makeponto4 {statusPonto}')
            perform_actions4(driver)

    except requests.exceptions.RequestException as e:
        print(f"API is not reachable, using default settings: {e}")
        logging.debug(f'makeponto4 not {e}')
        perform_actions4(driver)

    except Exception as e:
        print(e)

    finally:
        driver.quit()

def makeponto5(our_str):

        logging.debug(f'makeponto4 not {e}')
        perform_actions4(driver)


def makeponto2e3(our_str):
    if our_str == '12':
        vtype='time2'
    else:
        vtype='time3'

    try:
        token = authenticate_and_get_token()  # Authenticate and retrieve token
        url = baseUrl+urlSetting    
        data_fetched = fetch_data_from_api(url, token)
        statusPonto = process_status_ponto(data_fetched,vtype)

        if statusPonto:
            logging.debug(f'makeponto2e3 {statusPonto}')
            perform_actions2e3(driver)

    except requests.exceptions.RequestException as e:
        print(f"API is not reachable, using default settings: {e}")
        logging.debug(f'makeponto2e3 not {e}')
        perform_actions2e3(driver)

    except Exception as e:
        print(e)

    finally:
        driver.quit()

def makeponto1():
    
    try:
        token = authenticate_and_get_token()  # Authenticate and retrieve token
        url = baseUrl+urlSetting    
        data_fetched = fetch_data_from_api(url, token)
        timeDefined = process_data_fetched(data_fetched)

        if timeDefined:
            logging.debug(f'makeponto1 {timeDefined}')
            perform_actions(driver, timeDefined)

    except requests.exceptions.RequestException as e:
        print(f"API is not reachable, using default settings: {e}")
        logging.debug(f'makeponto not {e}')

        perform_actions(driver, definedTimefixed)

    except Exception as e:
        print(e)

    finally:
        driver.quit()

# main functio groups 

def main(driver):

    hour_str == '08'
    makeponto1()

    if hour_str == '08':
        makeponto1()
    elif hour_str == '12' or hour_str == '13':
        makeponto2e3(hour_str)
    elif hour_str == '17':
        makeponto4(hour_str)
    elif hour_str == '14':
        makeponto5(hour_str)
    else:
        print("It's not the time for any scheduled tasks.")

if __name__ == "__main__":
    main(driver)


