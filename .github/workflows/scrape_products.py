import requests
import json
from bs4 import BeautifulSoup
import time
import re

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

# --- KONFIGURACJA ---
GMODSTORE_PROFILE_URL = "https://www.gmodstore.com/users/a38c2f0c-aed6-4be2-bd9a-befc47095ad4/products"
OUTPUT_JSON_FILE = "products.json"
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9'
}

def get_product_links(profile_url):
    print(f"Pobieranie strony profilu: {profile_url}")
    try:
        response = requests.get(profile_url, headers=HEADERS)
        if response.status_code != 200: return []
        soup = BeautifulSoup(response.text, 'lxml')
        product_links = soup.select('a[href*="/market/view/"]')
        unique_links = list(set([link['href'] for link in product_links if '/market/view/' in link['href']]))
        print(f"Znaleziono {len(unique_links)} unikalnych linków do produktów.")
        return unique_links
    except Exception as e:
        print(f"Błąd połączenia: {e}")
        return []

def get_product_details_with_selenium(driver, product_url):
    print(f"  Pobieranie szczegółów z: {product_url}")
    try:
        driver.get(product_url)
        time.sleep(3)
        
        page_source = driver.page_source
        soup = BeautifulSoup(page_source, 'lxml')
        
        name_tag = soup.find('h1')
        name = name_tag.text.strip() if name_tag else "Nie znaleziono nazwy"
        
        views = "N/A"
        sales = "N/A"

        page_text = soup.get_text()
        views_match = re.search(r'Views:\s*([\d,]+)', page_text)
        if views_match: views = views_match.group(1)
        sales_match = re.search(r'Purchases:\s*([\d,]+)', page_text)
        if sales_match: sales = sales_match.group(1)

        print(f"    -> Znaleziono: {name}, Wyświetlenia: {views}, Sprzedaż: {sales}")
        return {"name": name, "url": product_url, "views": views, "sales": sales}
    except Exception as e:
        print(f"  Krytyczny błąd podczas przetwarzania strony {product_url}. Błąd: {e}")
        return None

def scrape_and_save():
    product_links = get_product_links(GMODSTORE_PROFILE_URL)
    if not product_links:
        print("Nie znaleziono linków, przerywam.")
        return

    print("\nInicjalizacja przeglądarki w tle...")
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)

    all_products_data = []
    for link in product_links:
        details = get_product_details_with_selenium(driver, link)
        if details: all_products_data.append(details)
    
    driver.quit()

    with open(OUTPUT_JSON_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_products_data, f, indent=2, ensure_ascii=False)
    
    print(f"\nZakończono! Zapisano dane dla {len(all_products_data)} produktów do pliku '{OUTPUT_JSON_FILE}'.")

if __name__ == "__main__":
    scrape_and_save()