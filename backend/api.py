from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
import pandas as pd
import time

# Setup Chrome options
options = webdriver.ChromeOptions()
options.add_argument("--headless")  # Run in background
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

# Path to your ChromeDriver
service = Service("chromedriver-linux64/chromedriver")  # <-- replace with your actual path

# Start browser
driver = webdriver.Chrome(service=service, options=options)

# Load the Growjo Top 10,000 list
driver.get("https://growjo.com/")

time.sleep(5)  # Let page load JS

# Go to full list
driver.get("https://growjo.com/company/Growjo_10000")  # Direct link to the table page
time.sleep(5)

# Get table rows
rows = driver.find_elements(By.CSS_SELECTOR, "table tr")[1:]  # skip header

data = []
for row in rows:
    cols = row.find_elements(By.TAG_NAME, "td")
    if len(cols) >= 10:
        data.append({
            "Rank": cols[0].text,
            "Company": cols[1].text,
            "City": cols[2].text,
            "Country": cols[3].text,
            "Funding": cols[4].text,
            "Industry": cols[5].text,
            "Employees": cols[6].text,
            "Revenue": cols[7].text,
            "Growth %": cols[8].text,
            "Person Name": cols[9].text,
            "Title": cols[10].text,
        })

# Save to DataFrame
df = pd.DataFrame(data)
driver.quit()

# Preview and export
print(df.head())
df.to_csv("growjo_companies.csv", index=False)
