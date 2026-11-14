import urllib.request
import re

url = 'https://www.netflix.com/browse/genre/34399'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9'
}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print("Status:", resp.status)
        print("Length:", len(html))
        
        # Check title
        title_match = re.search(r'<title>(.*?)</title>', html)
        if title_match:
            print("Title:", title_match.group(1))
            
        # Extract row headings or categories
        rows = re.findall(r'<h2[^>]*class="[^"]*row-header-title[^"]*"[^>]*>(.*?)</h2>', html)
        if not rows:
            rows = re.findall(r'<h2[^>]*>(.*?)</h2>', html)
        print("Row categories found:", rows[:15])
        
        # Extract sample card elements
        cards = re.findall(r'<span[^>]*class="[^"]*title-title[^"]*"[^>]*>(.*?)</span>', html)
        print("Sample movie titles:", cards[:15])
        
        # Look for genre sub-nav or dropdowns
        genres = re.findall(r'<a[^>]*class="[^"]*sub-menu-link[^"]*"[^>]*>(.*?)</a>', html)
        print("Sub-genres:", genres[:10])
except Exception as e:
    print("Error:", e)

