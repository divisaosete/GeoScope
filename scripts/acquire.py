import urllib.request,json,pathlib,concurrent.futures,hashlib
root=pathlib.Path(__file__).resolve().parents[1]
urls={
'world.geojson':'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson',
'countries.json':'https://api.worldbank.org/v2/country?format=json&per_page=400',
'population.json':'https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?date=2023&format=json&per_page=400',
'gdp.json':'https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.CD?date=2023&format=json&per_page=400',
'gdppc.json':'https://api.worldbank.org/v2/country/all/indicator/NY.GDP.PCAP.CD?date=2023&format=json&per_page=400',
'area.json':'https://api.worldbank.org/v2/country/all/indicator/AG.SRF.TOTL.K2?date=2023&format=json&per_page=400',
'd3.min.js':'https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js',
'd3-LICENSE.txt':'https://raw.githubusercontent.com/d3/d3/v7.9.0/LICENSE'
}
def download(item):
 name,url=item
 with urllib.request.urlopen(url,timeout=90) as r: content=r.read()
 target=root/('assets' if name.startswith('d3') else 'data/raw')/name
 target.write_bytes(content)
 return {'file':str(target.relative_to(root)),'url':url,'sha256':hashlib.sha256(content).hexdigest(),'bytes':len(content),'retrieved':'2026-10-27'}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
 records=list(pool.map(download,urls.items()))
(root/'data/acquisition.json').write_text(json.dumps(records,indent=2),encoding='utf-8')
print(json.dumps(records,indent=2))
