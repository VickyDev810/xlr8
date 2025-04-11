from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
import pandas as pd
import time

# Setup Chrome options
options = webdriver.ChromeOptions()
options.add_argument("--headless")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

# Define data extraction from rows
def define_data(rows):
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
    return data

# Scrape currently loaded table data
def scrape_data(driver):
    rows = driver.find_elements(By.CSS_SELECTOR, "table tr")[1:]  # skip header
    return define_data(rows)

# Scroll to load more content
def load_more(driver):
    last_height = driver.execute_script("return document.body.scrollHeight")
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(0.5)
    new_height = driver.execute_script("return document.body.scrollHeight")
    return new_height != last_height

# Runner function
def main():
    service = Service("chromedriver-linux64/chromedriver")  # Update path if needed
    driver = webdriver.Chrome(service=service, options=options)

    try:
        driver.get("https://growjo.com/company/Growjo_10000")
        time.sleep(1)

        all_data = []
        seen_rows = set()

        while True:
            print("🔄 Scanning page...")
            new_data = scrape_data(driver)

            # Avoid duplicates by checking a unique field (e.g., Company + Rank)
            for entry in new_data:
                unique_key = (entry["Company"], entry["Rank"])
                if unique_key not in seen_rows:
                    all_data.append(entry)
                    seen_rows.add(unique_key)

            if not load_more(driver):
                print("✅ No more data to load.")
                break

        df = pd.DataFrame(all_data)
        df.to_csv("growjo_data.csv", index=False)
        print("✅ Data saved to growjo_data.csv")

    finally:
        driver.quit()

# Only run if this script is executed directly
if __name__ == "__main__":
    main()
