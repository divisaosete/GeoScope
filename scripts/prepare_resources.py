from pathlib import Path
import json,zipfile,re,html,pdfplumber
r=Path(__file__).resolve().parents[1];raw=r/'data/raw/resources';countries=json.loads((r/'data/countries.json').read_text(encoding='utf-8'));ids={c['id'] for c in countries}
sources={
'eia':dict(name='EIA · International Energy Statistics',url='https://www.eia.gov/international/',download='https://api.eia.gov/bulk/INTL.zip',license='Domínio público; atribuição EIA',terms='https://www.eia.gov/about/copyrights_reuse.php',edition='Snapshot 27/10/2026'),
'usgs-lithium':dict(name='USGS · MCS 2026',url='https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-lithium.pdf',license='Domínio público USGS; atribuição',terms='https://www.usgs.gov/faqs/are-usgs-reportspublications-copyrighted',edition='Fevereiro de 2026'),
'usgs-rare-earths':dict(name='USGS · MCS 2026',url='https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-rare-earths.pdf',license='Domínio público USGS; atribuição; notas de fontes derivadas preservadas',terms='https://www.usgs.gov/faqs/are-usgs-reportspublications-copyrighted',edition='Fevereiro de 2026'),
'wna':dict(name='World Nuclear Association',url='https://world-nuclear.org/information-library/Nuclear-Fuel-Cycle/Mining-of-Uranium/World-Uranium-Mining-Production',license='© World Nuclear Association; recorte de 12 países e uma coluna, inferior a 150 palavras; atribuição e link',terms='https://world-nuclear.org/general/permission-for-use-of-content',edition='Página consultada em 27/10/2026')}
def indicator(label,measure,unit,source,description):return dict(label=label,measure=measure,kind='production',unit=unit,year=2024,sourceId=source,status='available',description=description,observations={})
ind={
'oil':indicator('Petróleo','Produção de petróleo bruto e condensado','mil barris/dia','eia','Média diária anual de petróleo bruto incluindo condensado de campo. Não inclui a série de todos os líquidos ou reservas. A EIA pode incorporar estimativas e revisões, sem flag por observação neste arquivo.'),
'gas':indicator('Gás natural','Produção de gás natural seco','bilhões de m³/ano','eia','Produção anual de gás natural seco, na unidade BCM original da EIA. Não equivale a produção bruta, reservas ou ocorrência. A EIA pode incorporar estimativas e revisões, sem flag por observação neste arquivo.'),
'lithium':indicator('Lítio','Produção mineira de lítio','t de Li/ano','usgs-lithium','Toneladas métricas de conteúdo de lítio, não carbonato de lítio equivalente. USGS MCS 2026, tabela World Mine Production and Reserves, coluna 2024. Estimativas identificadas; EUA têm dado confidencial (W).'),
'uranium':indicator('Urânio','Produção mineira de urânio','t de U/ano','wna','Toneladas de urânio contido, não U3O8. Tabela de produção por país, coluna 2024. Estimativas indicadas pela WNA. Não inclui o agregado Others.'),
'rare-earths':indicator('Terras raras','Produção mineira de terras raras','t de REO/ano','usgs-rare-earths','Toneladas métricas de óxidos de terras raras equivalentes (REO). Inclui lantanídeos e ítrio, exclui a maior parte do escândio. Não representa refino nem reservas. Zeros da tabela preservados.')}
audit=[]
def add(key,iso,value,estimated,locator,**extra):
 assert iso in ids,(key,iso)
 d=ind[key];rec=dict(value=value,year=2024,unit=d['unit'],sourceId=d['sourceId'],status='available' if value is not None else 'unavailable',estimated=estimated,sourceLocator=locator,**extra);d['observations'][iso]=rec
 audit.append(dict(resource=key,countryCode=iso,**rec))
with zipfile.ZipFile(raw/'eia-INTL.zip') as z:
 with z.open('INTL.txt') as f:
  for line in f:
   x=json.loads(line);sid=x.get('series_id','');iso=x.get('geography');key=None
   if iso not in ids:continue
   if sid==f'INTL.57-1-{iso}-TBPD.A':key='oil';assert x['units']=='thousand barrels per day'
   if sid==f'INTL.26-1-{iso}-BCM.A':key='gas';assert x['units']=='billion cubic meters'
   if key:
    v=dict(x['data']).get('2024');v=v if isinstance(v,(int,float)) and not isinstance(v,bool) else None
    add(key,iso,v,None,sid,sourceUpdated=x.get('last_updated'),estimationNote='Pode incluir estimativas da EIA; não discriminadas por observação.',originalUnit=x['units'])
# Extract only the World Mine Production and Reserves table; remove small superscript footnote digits, not values.
map_names={'United States':'USA','Argentina':'ARG','Australia':'AUS','Brazil':'BRA','Canada':'CAN','Chile':'CHL','China':'CHN','Mali':'MLI','Portugal':'PRT','Zimbabwe':'ZWE','Burma':'MMR','Greenland':'GRL','India':'IND','Madagascar':'MDG','Malaysia':'MYS','Nigeria':'NGA','Russia':'RUS','South Africa':'ZAF','Tanzania':'TZA','Thailand':'THA','Vietnam':'VNM'}
for key,filename in [('lithium','lithium-2026.pdf'),('rare-earths','rare-earths-2026.pdf')]:
 with pdfplumber.open(raw/filename) as doc:
  page=doc.pages[1];clean=page.filter(lambda c:c.get('object_type')!='char' or c.get('size',10)>7.5).extract_text()
  table=clean.split('Mine production Reserves')[1].split('World total')[0]
  (raw/(key+'-table.txt')).write_text(table,encoding='utf-8')
  for line in table.splitlines():
   for name,iso in map_names.items():
    if line.startswith(name+' '):
     token=line[len(name):].split()[0];value=None if token=='W' else 0 if token=='—' else int(token.replace(',',''))
     reported=(key=='lithium' and iso in ['ARG','CHL']) or (key=='rare-earths' and iso=='USA')
     note='Dado confidencial na fonte (W).' if token=='W' else 'Valor reportado (nota da fonte).' if reported else 'Estimativa USGS indicada no cabeçalho da tabela.'
     if key=='rare-earths' and iso in ['MMR','MDG','MYS','THA','VNM']:note='Estimativa USGS baseada em importações reportadas pela China (nota 12; Trade Data Monitor).'
     add(key,iso,value,False if reported else True,'MCS 2026, '+filename+', página 2, tabela World Mine Production and Reserves, coluna 2024',note=note,sourceToken=token)
     break
s=(raw/'uranium.html').read_text(encoding='utf-8');table=re.findall(r'<table.*?</table>',s,re.S)[0];wnamap={'Kazakhstan':'KAZ','Canada':'CAN','Namibia':'NAM','Australia':'AUS','Uzbekistan (est.)':'UZB','Russia':'RUS','China (est.)':'CHN','Niger':'NER','India (est.)':'IND','South Africa (est.)':'ZAF','Ukraine (est.)':'UKR','USA':'USA'}
for tr in re.findall(r'<tr.*?</tr>',table,re.S):
 cells=[html.unescape(re.sub('<[^>]+>','',v)).strip() for v in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>',tr,re.S)]
 if cells and cells[0] in wnamap:add('uranium',wnamap[cells[0]],int(cells[-1].replace(',','')),'(est.)' in cells[0],'World Uranium Mining Production, Production from mines (tonnes U), coluna 2024',sourceName=cells[0])
assert len(ind['lithium']['observations'])==10 and len(ind['rare-earths']['observations'])==16 and len(ind['uranium']['observations'])==12
result=dict(version=1,retrieved='2026-10-27',sources=sources,indicators=ind,limitations='Produção não é reserva nem ocorrência. Não se inferem recursos a partir de ausência de produção. Recorte 2024; cobertura limitada à fonte e às geometrias Natural Earth. Downloads do Energy Institute retornaram HTTP 403; EIA oficial usada como alternativa.')
(r/'data/resources.json').write_text(json.dumps(result,ensure_ascii=False,separators=(',',':')),encoding='utf-8');(raw/'extracted-observations.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding='utf-8')
for k,d in ind.items():print(k,len(d['observations']),sum(o['value'] is not None for o in d['observations'].values()),'available',sum(o['value']==0 for o in d['observations'].values()),'zeros')
