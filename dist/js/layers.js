import {available,number,$} from './utils.js';
import {createResourceLayer} from './resources.js';
export const labels={political:'Mapa político',population:'População',gdp:'PIB nominal',gdppc:'PIB per capita',resources:'Recursos estratégicos'};
export function createLayer(countries,key,resources=null,resourceKey='oil'){
 $('map-title').textContent=labels[key].toUpperCase();
 if(key==='political'){$('coverage').textContent=`${countries.length} ENTIDADES`; $('legend').innerHTML='<p>Países e territórios · fronteiras da fonte</p><p><span style="color:#8effed">━</span> País selecionado</p>';return ()=> '#254456';}
 if(key==='resources')return createResourceLayer(countries,resources,resourceKey);
 const values=countries.map(c=>c.indicators[key]).filter(available).map(r=>r.value).filter(v=>v>0),min=Math.min(...values),max=Math.max(...values);
 $('coverage').textContent=`2023 · ${values.length}/${countries.length} COM DADOS POSITIVOS`;
 if(!values.length){$('legend').innerHTML='<p><span class="key"></span>Nenhum dado disponível</p>';return ()=>'url(#nodata)';}
 const scale=d3.scaleSequentialLog(d3.interpolateRgb('#193647','#67dece')).domain([min,max]);
 $('legend').innerHTML=`<p>${labels[key]} · ${key==='population'?'habitantes':'US$ correntes'+(key==='gdppc'?' / habitante':'')} · 2023</p><div class="gradient"></div><div class="ticks"><span>${number(min,true)}</span><span>${number(Math.sqrt(min*max),true)}</span><span>${number(max,true)}</span></div><p>Escala logarítmica · Banco Mundial</p><p><span class="key"></span>Dados não disponíveis</p><p><span style="color:#b9b6de">■</span> Zero informado pela fonte</p>`;
 return c=>{const r=c?.indicators[key];return !available(r)?'url(#nodata)':r.value===0?'#b9b6de':scale(r.value);};
}
