from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
import pandas as pd
import time

class GrowjoScraper: 
    def __init__(self, chromedriver_path): 
        options = webdriver.ChromeOptions() 
        options.add_argument("--headless") 
        options.add_argument("--no-sandbox") 
        options.add_argument("--disable-dev-shm-usage") 
        service = Service(chromedriver_path) 
        self.driver = webdriver.Chrome(service=service, options=options) 
        self.base_url = "https://growjo.com/company/Growjo_10000" 
        self.data = []

    def open_base_url(self):
        print("Opening base URL...")
        self.driver.get(self.base_url)
        time.sleep(5)

    def scrape_table(self):
        print("Scraping page...")
        rows = self.driver.find_elements(By.CSS_SELECTOR, "table tr")[1:]  # skip header
        for row in rows:
            cols = row.find_elements(By.TAG_NAME, "td")
            if len(cols) >= 9:
                try:
                    a_tags = cols[1].find_elements(By.TAG_NAME, "a")
                    company_name = a_tags[1].text.strip() if len(a_tags) > 1 else cols[1].text.strip()
                except:
                    company_name = cols[1].text.strip()

                self.data.append({
                    "Rank": cols[0].text.strip(),
                    "Company": company_name,
                    "City": cols[2].text.strip(),
                    "Country": cols[3].text.strip(),
                    "Funding": cols[4].text.strip(),
                    "Industry": cols[5].text.strip(),
                    "Employees": cols[6].text.strip(),
                    "Revenue": cols[7].text.strip(),
                    "Growth %": cols[8].text.strip()
                })

    def go_to_next_page(self, current_page):
        try:
            next_button = self.driver.find_element(By.XPATH, f"//a[@role='button' and text()='{current_page+1}']")
            self.driver.execute_script("arguments[0].click();", next_button)
            time.sleep(3)
            return True
        except:
            return False

    def run(self):
        self.open_base_url()
        total_pages = 200
        for page in range(1, total_pages + 1):
            print(f"Scraping page {page}...")
            self.scrape_table()
            if page < total_pages:
                success = self.go_to_next_page(page)
                if not success:
                    print(f"⚠️ Couldn't go to page {page+1}")
                    break
        self.driver.quit()
        df = pd.DataFrame(self.data)
        print(f"✅ Scraped {len(df)} rows.")
        df.to_csv("output/growjo_top_10000.csv", index=False)
        print("💾 Saved to growthlist_growjo_top_10000.csv")

