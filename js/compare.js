import {$,escapeHTML,value,reference,available} from './utils.js';
import {resourceIndicator,resourceObservation,resourceValue,resourceReference} from './resources.js';
export function setupCompare(countries,resourceContext=()=>({data:null,key:'oil'})){
 const a=$('country-a'),b=$('country-b'),lookup=new Map(countries.map(c=>[c.id,c]));
 a.replaceChildren(new Option('Selecionar país',''));b.replaceChildren(new Option('Selecionar país',''));
 for(const c of countries){for(const el of [a,b]){const o=document.createElement('option');o.value=c.id;o.textContent=c.name;el.append(o);}}
 function render(){const ca=lookup.get(a.value),cb=lookup.get(b.value);if(!ca||!cb){$('comparison').innerHTML='<p class="empty">Selecione dois países para iniciar a comparação.</p>';return;}
 const rows=Object.entries({population:'População',area:'Área territorial',gdp:'PIB nominal',gdppc:'PIB per capita'}).map(([key,label])=>{const ra=ca.indicators[key],rb=cb.indicators[key],max=available(ra)&&available(rb)?Math.max(ra.value,rb.value):null;return `<tr><td>${label}</td>${[ra,rb].map(r=>`<td>${value(r,key)}<small>${reference(r)}</small>${max>0?`<div class="bar" style="--width:${r.value/max*100}%" aria-hidden="true"></div>`:''}</td>`).join('')}</tr>`;}).join('');
 const context=resourceContext(),d=resourceIndicator(context.data,context.key);
 const resourceRow=d?`<tr><td>${escapeHTML(d.label)}<small>${escapeHTML(d.measure)}</small></td>${[ca,cb].map(c=>{const r=resourceObservation(context.data,context.key,c.id);return `<td>${resourceValue(r)}<small>${resourceReference(context.data,context.key,r)}</small></td>`;}).join('')}</tr>`:'<tr><td>Recursos estratégicos</td><td>Dados não disponíveis</td><td>Dados não disponíveis</td></tr>';
 $('comparison').innerHTML=`${ca.id===cb.id?'<p class="comparison-note">Você selecionou o mesmo país nos dois campos.</p>':''}<div class="table-wrap"><table><caption class="sr-only">Comparação econômica de 2023 e recurso selecionado de 2024</caption><thead><tr><th scope="col">Indicador</th><th scope="col">${escapeHTML(ca.name)}</th><th scope="col">${escapeHTML(cb.name)}</th></tr></thead><tbody>${rows}${resourceRow}</tbody></table></div><p class="comparison-note">Barras lineares com origem zero, proporcionais dentro de cada linha; não comparar comprimentos entre indicadores. Economia: 2023; recurso selecionado: 2024. Não há pontuação ou classificação de países.</p>`;
 }
 a.onchange=b.onchange=render;$('swap').onclick=()=>{[a.value,b.value]=[b.value,a.value];render();};$('clear').onclick=()=>{a.value=b.value='';render();};
 return {refresh:render,add(id){if(!a.value||b.value)a.value=id;else b.value=id;render();$('compare-title').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}};
}
