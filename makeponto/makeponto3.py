import configparser
import time
import os
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
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

# Write to the log file
with open(log_file_path, "a") as file:
    file.write(f"{now} - Script was run\n")

driver = webdriver.Chrome()

# Retrieve credentials
username = config.get('credentials', 'username')
password = config.get('credentials', 'password')

# Open a web page (for example, Google)
driver.get("https://intranet.acpgroup.com.br/ControleAcesso/Seguranca/Login?ReturnUrl=%2fhoras")
time.sleep(2)

def click_submit_button(driver):
    password_field2 = driver.find_element(By.ID, "btn-registrar") 
    password_field2.click()
    time.sleep(5)
    success = driver.save_screenshot('screenshot3.png')

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

make_login(driver)

click_submit_button(driver)
time.sleep(5)

# Close the browser window
driver.quit()

