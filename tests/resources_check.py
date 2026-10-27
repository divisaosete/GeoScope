"""Audit each extracted record against downloaded primary sources and snapshot anchors."""
from pathlib import Path
import json,zipfile,hashlib,math
r=Path(__file__).resolve().parents[1];data=json.loads((r/'data/resources.json').read_text(encoding='utf-8'))
for download in json.loads((r/'data/resources-acquisition.json').read_text(encoding='utf-8')):
 if 'sha256' in download:assert hashlib.sha256((r/download['file']).read_bytes()).hexdigest()==download['sha256']
audit=json.loads((r/'data/raw/resources/extracted-observations.json').read_text(encoding='utf-8'))
assert len(audit)==384
for row in audit:
 actual=data['indicators'][row['resource']]['observations'][row['countryCode']]
 assert actual=={k:v for k,v in row.items() if k not in ['resource','countryCode']}
 assert actual['year']==2024 and actual['status']==('unavailable' if actual['value'] is None else 'available')
 if actual['value'] is not None:assert math.isfinite(actual['value']) and actual['value']>=0
matched=0
with zipfile.ZipFile(r/'data/raw/resources/eia-INTL.zip') as z:
 with z.open('INTL.txt') as f:
  for line in f:
   x=json.loads(line)
   for key in ['oil','gas']:
    for iso,obs in data['indicators'][key]['observations'].items():
     if x.get('series_id')==obs['sourceLocator']:
      value=dict(x['data']).get('2024');value=value if isinstance(value,(float,int)) else None
      assert value==obs['value'];assert x['geography']==iso;matched+=1
assert matched==346
# Anchors visually checked against USGS PDF table, not derived from extraction code.
for key,expected in {
 'lithium':{'ARG':13800,'AUS':82700,'BRA':10200,'CAN':4820,'CHL':48900,'CHN':41400,'MLI':770,'PRT':380,'ZWE':20000,'USA':None},
 'rare-earths':{'USA':45500,'AUS':29000,'BRA':560,'MMR':27000,'CAN':0,'CHN':270000,'GRL':0,'IND':2900,'MDG':1400,'MYS':140,'NGA':1500,'RUS':2600,'ZAF':0,'TZA':0,'THA':2100,'VNM':300},
 'uranium':{'KAZ':23270,'CAN':14309,'NAM':7333,'AUS':4598,'UZB':4000,'RUS':2738,'CHN':1600,'NER':962,'IND':500,'ZAF':200,'UKR':288,'USA':260}
}.items():
 assert {iso:o['value'] for iso,o in data['indicators'][key]['observations'].items()}==expected
print('PASS: 384 resource records; 346 EIA records checked against original series; all mineral/uranium snapshot anchors and source SHA256 verified.')
