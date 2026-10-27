import {$,normalize,escapeHTML,value,reference} from './utils.js';
import {renderResourcePanel} from './resources.js';
const metrics={population:'População total',gdp:'PIB nominal',gdppc:'PIB per capita',area:'Área territorial'};
export function renderCountry(c,onCompare,resourceContext={data:null,key:'oil'}){
 $('country').innerHTML=`<span class="country-code">${escapeHTML(c.id)}</span><h2>${escapeHTML(c.name)}</h2><p class="country-meta">${escapeHTML(c.capital||'Capital indisponível')}<br>${escapeHTML(c.region)}</p>${resourceContext.active?renderResourcePanel(resourceContext.data,resourceContext.key,c):''}<dl class="metrics">${Object.entries(metrics).map(([key,label])=>`<div class="metric"><dt>${label}</dt><dd>${value(c.indicators[key],key,true)}<small>${reference(c.indicators[key])}</small></dd></div>`).join('')}</dl>${!resourceContext.active?renderResourcePanel(resourceContext.data,resourceContext.key,c):''}<button class="add-compare" id="add-compare">Adicionar à comparação ↓</button>`;
 $('add-compare').onclick=()=>onCompare(c.id);
}
export function setupSearch(countries,onSelect){
 const input=$('search'),list=$('results');let matches=[],active=-1;
 const close=()=>{list.hidden=true;input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');active=-1;};
 const choose=c=>{input.value=c.name;close();onSelect(c.id,true);};
 function render(){list.replaceChildren();matches.forEach((c,i)=>{const li=document.createElement('li');li.id='result-'+i;li.role='option';li.setAttribute('aria-selected',String(i===active));li.textContent=`${c.name} · ${c.id}`;li.addEventListener('pointerdown',e=>e.preventDefault());li.onclick=()=>choose(c);list.append(li);});if(!matches.length){const li=document.createElement('li');li.textContent='Nenhum país encontrado nesta cartografia.';li.setAttribute('role','status');list.append(li);}list.hidden=false;input.setAttribute('aria-expanded','true');if(active>=0){input.setAttribute('aria-activedescendant','result-'+active);list.children[active].scrollIntoView({block:'nearest'});}else input.removeAttribute('aria-activedescendant');}
 input.oninput=()=>{const query=normalize(input.value);if(!query){close();return;}matches=countries.filter(c=>normalize(`${c.name} ${c.international} ${c.id}`).includes(query)).slice(0,12);active=-1;render();};
 input.onkeydown=e=>{if(e.key==='Escape'){close();return;}if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();if(!matches.length)return;active=(active+(e.key==='ArrowDown'?1:-1)+matches.length)%matches.length;render();}if(e.key==='Enter'&&matches.length&&!list.hidden){e.preventDefault();choose(matches[active<0?0:active]);}};
 input.onblur=close;
}
