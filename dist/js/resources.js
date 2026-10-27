import {$,available,escapeHTML,number} from './utils.js';

export const RESOURCE_KEYS=['oil','gas','lithium','uranium','rare-earths'];

export function validateResources(data,countries){
 if(data?.version!==1||!data.sources||!data.indicators)throw new Error('Estrutura de recursos inválida.');
 const ids=new Set(countries.map(c=>c.id));
 for(const key of RESOURCE_KEYS){
  const d=data.indicators[key],s=data.sources[d?.sourceId];
  if(!d||d.kind!=='production'||!d.label||!d.measure||!d.unit||!Number.isInteger(d.year)||!d.observations||!s?.name||!s.url?.startsWith('https://'))throw new Error(`Metadados de ${key} inválidos.`);
  for(const [id,r] of Object.entries(d.observations)){
   if(!ids.has(id)||r.year!==d.year||r.unit!==d.unit||r.sourceId!==d.sourceId||!r.sourceLocator||![true,false,null].includes(r.estimated))throw new Error(`Identidade ou referência inválida em ${key}/${id}.`);
   if(r.value===null){if(r.status!=='unavailable')throw new Error(`Ausência inválida em ${key}/${id}.`);}
   else if(!available(r))throw new Error(`Valor inválido em ${key}/${id}.`);
  }
 }
 return data;
}

export const resourceIndicator=(data,key)=>data?.indicators?.[key]??null;
export const resourceObservation=(data,key,id)=>resourceIndicator(data,key)?.observations[id]??null;
export function resourceValue(r){return available(r)?new Intl.NumberFormat('pt-BR',r.value>0&&r.value<1?{maximumSignificantDigits:3}:{maximumFractionDigits:2}).format(r.value):'Dados não disponíveis';}
export function resourceReference(data,key,r){
 const d=resourceIndicator(data,key);if(!d)return 'Dados não disponíveis';
 const s=data.sources[d.sourceId];
 const flag=available(r)?r.estimated===true?'Estimativa da fonte':r.estimated===false?'Valor publicado pela fonte':'Pode incluir estimativas da EIA':'Sem observação disponível neste recorte';
 return `${d.year} · ${escapeHTML(d.unit)} · <a href="${escapeHTML(s.url)}" target="_blank" rel="noreferrer">${escapeHTML(d.sourceId==='wna'?'© '+s.name:s.name)} ↗</a><br>${flag}`;
}

export function renderResourcePanel(data,key,country){
 const d=resourceIndicator(data,key),r=resourceObservation(data,key,country.id);
 if(!d)return '<section class="resource-details"><h3>Recursos estratégicos</h3><p>Dados não disponíveis · falha no carregamento da base local.</p></section>';
 return `<section class="resource-details" aria-label="Recurso estratégico selecionado"><p class="section-label">RECURSO SELECIONADO</p><h3>${escapeHTML(d.label)}</h3><p>${escapeHTML(d.measure)}</p><strong>${resourceValue(r)}</strong><small>${resourceReference(data,key,r)}</small>${r?.note?`<p>${escapeHTML(r.note)}</p>`:''}<details><summary>Definição e limites</summary><p>${escapeHTML(d.description)}</p><p>Produção não é reserva nem ocorrência geológica. Dados não disponíveis não significam ausência do recurso.</p></details></section>`;
}

export function createResourceLayer(countries,data,key){
 const d=resourceIndicator(data,key);
 if(!d){$('map-title').textContent='RECURSOS ESTRATÉGICOS';$('coverage').textContent='DADOS NÃO DISPONÍVEIS';$('legend').textContent='Base de recursos não carregada. As camadas econômicas continuam disponíveis.';return ()=>'url(#nodata)';}
 const source=data.sources[d.sourceId],records=countries.map(c=>resourceObservation(data,key,c.id)).filter(available),positives=records.map(r=>r.value).filter(v=>v>0),min=Math.min(...positives),max=Math.max(...positives);
 $('map-title').textContent=d.label.toUpperCase()+' / PRODUÇÃO';$('coverage').textContent=`${d.year} · ${records.length}/${countries.length} COM DADOS`;
 const scale=positives.length?d3.scaleSequentialLog(d3.interpolateRgb('#193647','#67dece')).domain([min,max]):null;
 const tick=v=>v>0&&v<1?new Intl.NumberFormat('pt-BR',{maximumSignificantDigits:3}).format(v):number(v,true);
 $('legend').innerHTML=`<p><b>${escapeHTML(d.measure)}</b><br>${escapeHTML(d.unit)} · ${d.year}</p>${scale?`<div class="gradient"></div><div class="ticks"><span>${tick(min)}</span><span>${tick(Math.sqrt(min*max))}</span><span>${tick(max)}</span></div><p>Escala logarítmica própria deste recurso</p>`:''}<p><span style="color:#b9b6de">■</span> Zero de produção informado pela fonte</p><p><span class="key"></span>Dados não disponíveis</p><p><a href="${escapeHTML(source.url)}" target="_blank" rel="noreferrer">${escapeHTML(d.sourceId==='wna'?'© '+source.name:source.name)} ↗</a></p><p>Estimativas identificadas no painel. Sem dados não significa sem recursos.</p>`;
 return c=>{const r=resourceObservation(data,key,c.id);return !available(r)?'url(#nodata)':r.value===0?'#b9b6de':scale(r.value);};
}
