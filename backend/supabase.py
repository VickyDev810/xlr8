from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from dotenv import load_dotenv
import pandas as pd
import requests
import time
import os

# Load credentials from .env
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("❌ Missing Supabase credentials in .env file")

# Setup headers
headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

# Setup Selenium
options = webdriver.ChromeOptions()
options.add_argument("--headless")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

service = Service("chromedriver-linux64/chromedriver")  # Update path if needed
driver = webdriver.Chrome(service=service, options=options)

print("🔍 Loading Growjo 10000 page...")
driver.get("https://growjo.com/company/Growjo_10000")
time.sleep(5)

# Scrape data
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
            "Growth": cols[8].text,
            "PersonName": cols[9].text,
            "Title": cols[10].text,
        })

driver.quit()
print(f"✅ Scraped {len(data)} companies")

# Convert to your Startup model
startups = []
for idx, row in enumerate(data):
    startups.append({
        "id": idx + 1,
        "name": row["Company"],
        "description": f"{row['Company']} is a high-growth company in the {row['Industry']} industry.",
        "industry": row["Industry"],
        "location": f"{row['City']}, {row['Country']}",
        "logo": f"https://via.placeholder.com/150?text={''.join(row['Company'].split())[:2].upper()}",
    })

# Insert into Supabase
print("🚀 Inserting into Supabase...")
for s in startups:
    response = requests.post(
        f"{SUPABASE_URL}/rest/v1/startups",
        headers=headers,
        json=s
    )
    if response.status_code != 201:
        print(f"❌ Failed to insert {s['name']}: {response.text}")
    else:
        print(f"✅ Inserted {s['name']}")
