import json,pathlib
r=pathlib.Path(__file__).resolve().parents[1]
def load(n): return json.loads((r/'data/raw'/n).read_text(encoding='utf-8'))
def save(n,x): (r/'data'/n).write_text(json.dumps(x,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
world=load('world.geojson'); wb=load('countries.json'); assert wb[0]['pages']==1
countries={x['id']:x for x in wb[1] if x['region']['id']!='NA'}
records={}
for key,unit,code in [('population','habitantes','SP.POP.TOTL'),('gdp','US$ correntes','NY.GDP.MKTP.CD'),('gdppc','US$/habitante','NY.GDP.PCAP.CD'),('area','km²','AG.SRF.TOTL.K2')]:
 raw=load(key+'.json'); assert raw[0]['pages']==1
 records[key]={x['countryiso3code']:dict(value=x['value'],year=int(x['date']),unit=unit,indicator=code,sourceId='worldbank',status='available' if x['value'] is not None else 'unavailable') for x in raw[1] if x['countryiso3code'] in countries}
features=[]; catalog=[]
for f in world['features']:
 p=f['properties']; iso=p['ISO_A3_EH']; iso=iso if iso!='-99' else 'NE:'+p['ADM0_A3']; w=countries.get(p.get('WB_A3')) or countries.get(iso)
 # Do not join Northern Cyprus or Somaliland to the parent economy.
 if iso.startswith('NE:'): w=None
 dataid=w['id'] if w else iso
 name=p.get('NAME_PT') or p['ADMIN']
 f['properties']={'id':iso,'name':name,'international':p['ADMIN']}
 features.append(f)
 catalog.append(dict(id=iso,name=name,international=p['ADMIN'],capital=w['capitalCity'] if w and w['capitalCity'] else None,region=w['region']['value'] if w else p['CONTINENT'],wbCode=w['id'] if w else None,iso=iso if not iso.startswith('NE:') else None,indicators={k:v.get(dataid,dict(value=None,year=None,unit={'area':'km²','population':'habitantes','gdp':'US$ correntes','gdppc':'US$/habitante'}[k],sourceId='worldbank',status='unavailable')) for k,v in records.items()}))
save('world.geojson',dict(type='FeatureCollection',features=features));save('countries.json',catalog)
save('resources.json',dict(status='unavailable',indicators=['Petróleo: reservas','Gás natural: produção','Minerais críticos: produção'],reason='Nenhum dataset quantitativo validado e incorporado nesta versão. Não inferir ausência de recursos.'))
save('sources.json',dict(worldbank=dict(name='Banco Mundial · WDI',url='https://data.worldbank.org/',license='CC BY 4.0, com termos adicionais do Banco Mundial',retrieved='2026-10-27',year=2023),naturalearth=dict(name='Natural Earth',url='https://www.naturalearthdata.com/',license='Public domain',retrieved='2026-10-27',scale='1:110m')))
print('Countries:',len(catalog),'coverage:',{k:sum(c['indicators'][k]['value'] is not None for c in catalog) for k in records})
print('Special:',[(c['id'],c['name'],c['wbCode']) for c in catalog if c['id'].startswith('NE:')]);print('Names:',[(c['id'],c['name']) for c in catalog[:5]])
