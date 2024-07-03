import configparser
import time
import os
import random
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
import requests 
# Set up the WebDriver for Chrome

config = configparser.ConfigParser()
config.read('config.ini')


log_file_name = "logfile.log"

current_directory = os.getcwd()

log_file_path = os.path.join(current_directory, log_file_name)


now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

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

# Open a web page (for example, Google)
driver.get("https://intranet.acpgroup.com.br/ControleAcesso/Seguranca/Login?ReturnUrl=%2fhoras")
time.sleep(2)

def click_submit_button(driver):
    password_field2 = driver.find_element(By.ID, "btn-registrar") 
    password_field2.click()
    time.sleep(5)
    success = driver.save_screenshot('screenshot2.png')

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
    
def process_data_fetched(settings):
    reference_time_str = '08:00:00'
    reference_time = datetime.strptime(reference_time_str, '%H:%M:%S')

    for setting in settings:
        if setting['type'] == 'time2' and setting['status']:
            time_value = setting['overrideTime'] if setting['overrideTime'] else setting['defaultTime']
            time_value_dt = datetime.strptime(time_value, '%H:%M:%S')

            time_difference = time_value_dt - reference_time
            minutes_difference = int(time_difference.total_seconds() / 60)

            return minutes_difference
        
    return None


def make_login(driver):
    # Find and fill the password field
    password_field = driver.find_element(By.ID, "Pass2")  # Replace 'password' with the actual name attribute of the password field
    password_field.send_keys(password)
    time.sleep(2)
    # Find and fill the username field
    username_field = driver.find_element(By.NAME, "Login")  # Replace 'username' with the actual name attribute of the username field
    username_field.send_keys(username)
    time.sleep(2)
    # Find and click the login button
    login_button = driver.find_element(By.XPATH, '//button[@type="submit"]')  # Replace with the correct XPath for the login button
    login_button.click()
    time.sleep(5)

if __name__ == "__main__":

    try:
        token = authenticate_and_get_token()  # Authenticate and retrieve token
        url = "http://localhost:8080/api/records/settings"    
        data_fetched = fetch_data_from_api(url, token)
        averageTime = process_data_fetched(data_fetched)
        
        make_login(driver)

        click_submit_button(driver)
        time.sleep(5)
    except requests.exceptions.RequestException as e:
   
    finally:
        driver.quit()

