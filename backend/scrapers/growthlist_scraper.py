from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pandas as pd
import time


class GrowthListScraper:
    def __init__(self, driver_path="chromedriver-linux64/chromedriver", headless=True):
        options = webdriver.ChromeOptions()
        if headless:
            options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        service = Service(driver_path)
        self.driver = webdriver.Chrome(service=service, options=options)
        self.wait = WebDriverWait(self.driver, 15)
        self.base_url = "https://growthlist.co/india-startups/"
        self.data = []

    def load_and_expand_table(self):
        print("Loading page...")
        self.driver.get(self.base_url)

        # Wait for the table container
        self.wait.until(EC.presence_of_element_located((By.ID, "footable_parent_21788")))

        # Find the page size dropdown and select 100
        print("Setting entries to 100...")
        dropdown = Select(self.driver.find_element(By.CSS_SELECTOR, "select.nt_pager_selection"))
        dropdown.select_by_value("100")

        time.sleep(2)  # Let table refresh

    def scrape_table(self):
        print("Scraping table...")
        rows = self.driver.find_elements(By.CSS_SELECTOR, "#footable_parent_21788 table tbody tr")
        print(f"Found {len(rows)} rows.")

        for row in rows:
            cols = row.find_elements(By.TAG_NAME, "td")
            if len(cols) >= 6:
                self.data.append({
                    "Name": cols[0].text.strip(),
                    "Website": cols[1].text.strip(),
                    "Industry": cols[2].text.strip(),
                    "Country": cols[3].text.strip(),
                    "Funding Amount (USD)": cols[4].text.strip(),
                    "Funding Type": cols[5].text.strip(),
                    "Last Funding Date": cols[6].text.strip() if len(cols) > 6 else ""
                })

    def save_to_csv(self, filename="output/growthlist_indian_startups.csv"):
        df = pd.DataFrame(self.data)
        df.to_csv(filename, index=False)
        print(f"✅ Saved {len(self.data)} rows to {filename}")

    def quit(self):
        self.driver.quit()



