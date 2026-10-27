import pathlib,urllib.request,concurrent.futures,hashlib,json
r=pathlib.Path.cwd();out=r/'data/raw/resources';out.mkdir(parents=True,exist_ok=True)
urls={
'eia-INTL.zip':'https://api.eia.gov/bulk/INTL.zip',
'ei-2025.xlsx':'https://energyinst.org/__data/assets/excel_doc/0008/1656215/EI-Stats-Review-ALL-data.xlsx',
'lithium-2026.pdf':'https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-lithium.pdf',
'rare-earths-2026.pdf':'https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-rare-earths.pdf',
'uranium.html':'https://world-nuclear.org/information-library/Nuclear-Fuel-Cycle/Mining-of-Uranium/World-Uranium-Mining-Production',
'ei-terms.html':'https://energyinst.org/terms',
'wna-reuse.html':'https://world-nuclear.org/general/permission-for-use-of-content'
}
def get(item):
 n,u=item
 try:
  req=urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0 (GeoScope public data research)'})
  with urllib.request.urlopen(req,timeout=90) as response:b=response.read()
  (out/n).write_bytes(b);return dict(file='data/raw/resources/'+n,url=u,sha256=hashlib.sha256(b).hexdigest(),bytes=len(b),retrieved='2026-10-27')
 except Exception as e:return dict(file=n,url=u,error=str(e))
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:records=list(pool.map(get,urls.items()))
(r/'data/resources-acquisition.json').write_text(json.dumps(records,indent=2),encoding='utf-8');print(json.dumps(records,indent=2))
