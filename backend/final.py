from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import pandas as pd
import time

# Setup Chrome options
options = webdriver.ChromeOptions()
options.add_argument("--headless")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

# Path to your ChromeDriver
service = Service("chromedriver-linux64/chromedriver")  # Update path as needed
driver = webdriver.Chrome(service=service, options=options)

# Step 1: Load Growjo 10,000 list
driver.get("https://growjo.com/company/Growjo_10000")
time.sleep(5)

# Extract table rows
rows = driver.find_elements(By.CSS_SELECTOR, "table tr")[1:]  # skip header
data = []

for row in rows:
    cols = row.find_elements(By.TAG_NAME, "td")
    if len(cols) >= 10:
        company_link_elem = cols[1].find_element(By.TAG_NAME, "a")
        company_name = company_link_elem.text
        company_url = company_link_elem.get_attribute("href")

        data.append({
            "Id": cols[0].text,
            "Company": company_name,
            # "Company URL": company_url,
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

# Step 2: Visit each company page to get domain and logo
for entry in data:
    try:
        driver.get(entry["Company URL"])
        time.sleep(2)

        # Find domain (usually in <a> with href starting with http)
        domain_link = driver.find_element(By.XPATH, '//a[starts-with(@href, "http") and contains(@href, ".com")]')
        domain = domain_link.get_attribute("href").split("//")[-1].split("/")[0]
        entry["Domain"] = domain
        entry["Logo URL"] = f"https://www.google.com/s2/favicons?domain={domain}"
    except NoSuchElementException:
        entry["Domain"] = ""
        entry["Logo URL"] = ""
    except Exception as e:
        print(f"Error for {entry['Company']}: {e}")
        entry["Domain"] = ""
        entry["Logo URL"] = ""

# Finalize DataFrame
df = pd.DataFrame(data)
driver.quit()

# Output
print(df.head())
df.to_csv("growjo_enriched.csv", index=False)
