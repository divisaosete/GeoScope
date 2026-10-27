import {$,loadJSON} from './utils.js';
import {createMap} from './map.js';
import {createLayer} from './layers.js';
import {renderCountry,setupSearch} from './countries.js';
import {setupCompare} from './compare.js';
import {validateResources,resourceIndicator} from './resources.js';
let running=false;
const controls=()=>document.querySelectorAll('#search,#layers,#zoom-in,#zoom-out,#reset,#country-a,#country-b,#swap,#clear,#resource-select');
export async function start(){
 if(running)return;running=true;
 try{
  controls().forEach(el=>el.disabled=true);$('retry').hidden=true;$('retry').textContent='Tentar carregar novamente';$('retry').onclick=start;$('status').textContent='Carregando cartografia e indicadores…';
  if(!window.d3)throw new Error('A biblioteca cartográfica local não foi carregada. Verifique assets/d3.min.js e recarregue.');
  const [world,countries,resourceResult]=await Promise.all([loadJSON(new URL('../data/world.geojson',import.meta.url)),loadJSON(new URL('../data/countries.json',import.meta.url)),loadJSON(new URL('../data/resources.json',import.meta.url)).catch(error=>({loadError:error.message}))]);
  if(world.type!=='FeatureCollection'||!world.features?.length||!Array.isArray(countries)||!countries.length)throw new Error('Estrutura dos arquivos inválida.');
  const ids=new Set();for(const c of countries){if(!c.id||!c.name||!c.indicators||ids.has(c.id))throw new Error('Catálogo de países inválido.');ids.add(c.id);for(const key of ['population','gdp','gdppc','area']){const r=c.indicators[key];if(!r)throw new Error('Indicador ausente na estrutura.');if(r.value!==null&&(!Number.isFinite(r.value)||r.value<0||!Number.isInteger(r.year)))throw new Error('Valor ou ano inválido nos indicadores.');}}
  if(world.features.some(f=>!ids.has(f.properties?.id)||!['Polygon','MultiPolygon'].includes(f.geometry?.type)))throw new Error('Geometrias incompatíveis com o catálogo.');
  countries.sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
  let resources=null,resourceError='';try{if(resourceResult.loadError)throw new Error(resourceResult.loadError);resources=validateResources(resourceResult,countries);}catch(error){resourceError=error.message;console.warn('[GeoScope / recursos]',error);}
  let selected='BRA',layer=document.querySelector('input[name="layer"]:checked').value,resourceKey=$('resource-select').value,color;const lookup=new Map(countries.map(c=>[c.id,c]));
  if(!resources&&layer==='resources'){layer='political';document.querySelector('input[value="political"]').checked=true;}
  const context=()=>({data:resources,key:resourceKey,active:layer==='resources'});
  const compare=setupCompare(countries,context);
  const select=(id,focus=false)=>{const c=lookup.get(id);if(!c)return;selected=id;map.paint(color,selected);renderCountry(c,compare.add,context());if(focus)map.focus(id);const d=resourceIndicator(resources,resourceKey);$('status').textContent=layer==='resources'?`${c.name} selecionado · ${d.label} · produção · ${d.year}`:`${c.name} selecionado · ${countries.length} entidades cartográficas · indicadores econômicos de 2023`;};
  const map=createMap(world,countries,select);color=createLayer(countries,layer,resources,resourceKey);setupSearch(countries,select);
  if(document.querySelectorAll('#viewport .country-path').length!==world.features.length)throw new Error('A renderização do mapa não corresponde ao número de geometrias carregadas.');
  const refresh=()=>{color=createLayer(countries,layer,resources,resourceKey);$('resource-controls').hidden=Boolean(resources)&&layer!=='resources';const d=resourceIndicator(resources,resourceKey);$('resource-summary').textContent=d?`${d.measure} · ${d.unit} · ${d.year}`:`Dados não disponíveis. ${resourceError}`;select(selected);compare.refresh();};
  $('layers').onchange=e=>{if(e.target.name!=='layer')return;layer=e.target.value;refresh();};
  $('resource-select').onchange=()=>{resourceKey=$('resource-select').value;refresh();};
  select(selected);
  controls().forEach(el=>el.disabled=false);
  document.querySelector('input[value="resources"]').disabled=!resources;$('resource-select').disabled=!resources;refresh();
 }catch(error){console.error(error);$('status').textContent=`Não foi possível iniciar o GeoScope. ${error.message} Sirva esta pasta por HTTP/HTTPS e verifique os arquivos locais.`;$('retry').hidden=false;$('country').innerHTML='<h2>Dados não carregados</h2><p>Corrija o arquivo ou a conexão local e use “Tentar carregar novamente”.</p>';}
 finally{running=false;}
}
