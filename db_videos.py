import requests
from bs4 import BeautifulSoup as BS


url = 'http://localhost:8080/Home.html'

r = requests.get(url)
