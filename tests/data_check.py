import json,pathlib,hashlib,math,re
r=pathlib.Path(__file__).resolve().parents[1]
def read(p):return json.loads((r/p).read_text(encoding='utf-8'))
countries=read('data/countries.json');world=read('data/world.geojson');ids=[c['id'] for c in countries]
assert len(ids)==len(set(ids))==177
assert set(ids)=={f['properties']['id'] for f in world['features']}
for record in read('data/acquisition.json'):
 assert hashlib.sha256((r/record['file']).read_bytes()).hexdigest()==record['sha256']
count=0
for c in countries:
 for key,unit in [('population','habitantes'),('gdp','US$ correntes'),('gdppc','US$/habitante'),('area','km²')]:
  x=c['indicators'][key]
  assert x['unit']==unit
  if x['value'] is None:assert x['status']=='unavailable'
  else:
   assert math.isfinite(x['value']) and x['value']>=0 and x['year']==2023 and x['status']=='available'
   raw=read('data/raw/'+key+'.json')[1]
   original=next(t for t in raw if t['countryiso3code']==c['wbCode'])
   assert original['value']==x['value'];count+=1
for f in world['features']:assert f['geometry']['type'] in ['Polygon','MultiPolygon']
for p in (r/'dist').rglob('*'):
 if p.suffix in ['.html','.js','.css']:
  s=p.read_text(encoding='utf-8-sig')
  assert not re.search(r'(?:src|href)=[\"\']/[^/]',s)
for name,digest in read('dist/manifest.json').items():assert hashlib.sha256((r/'dist'/name).read_bytes()).hexdigest()==digest
print(f'PASS: 177 unique geometry matches; {count} observations exactly match raw WDI; units, years, nulls, SHA256 and distribution verified.')
