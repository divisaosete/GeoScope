import {$,motion} from './utils.js';
export function createMap(world,countries,onSelect){
 const svg=d3.select('#map'),g=d3.select('#viewport');g.selectAll('*').remove();
 const projection=d3.geoEqualEarth().fitExtent([[20,65],[980,540]],{type:'Sphere'}),path=d3.geoPath(projection),lookup=new Map(countries.map(c=>[c.id,c]));
 g.append('path').datum({type:'Sphere'}).attr('class','sphere').attr('d',path);
 g.append('path').datum(d3.geoGraticule10()).attr('class','graticule').attr('d',path);
 const paths=g.selectAll('.country-path').data(world.features).join('path').attr('class','country-path').attr('d',path).attr('data-id',f=>f.properties.id).attr('aria-label',f=>f.properties.name);
 paths.append('title').text(f=>f.properties.name);
 paths.on('click',(event,f)=>{if(!event.defaultPrevented)onSelect(f.properties.id);}).on('pointermove',(event,f)=>{if(event.pointerType==='touch')return;const tip=$('tooltip'),rect=$('map').getBoundingClientRect();tip.textContent=f.properties.name;tip.hidden=false;tip.style.left=Math.max(5,Math.min(rect.width-180,event.clientX-rect.left+12))+'px';tip.style.top=Math.max(45,event.clientY-rect.top-40)+'px';}).on('pointerleave',()=>{$('tooltip').hidden=true;});
 const zoom=d3.zoom().scaleExtent([1,12]).extent([[0,0],[1000,600]]).translateExtent([[0,0],[1000,600]]).on('start',()=>{$('tooltip').hidden=true;}).on('zoom',e=>{g.attr('transform',e.transform);$('zoom-level').textContent=e.transform.k.toFixed(1).replace('.',',')+'×';});
 svg.call(zoom).on('dblclick.zoom',null);
 $('zoom-in').onclick=()=>svg.transition().duration(motion()).call(zoom.scaleBy,1.5);
 $('zoom-out').onclick=()=>svg.transition().duration(motion()).call(zoom.scaleBy,1/1.5);
 $('reset').onclick=()=>svg.transition().duration(motion()).call(zoom.transform,d3.zoomIdentity);
 return {paint(color,selected){paths.attr('fill',f=>color(lookup.get(f.properties.id))).classed('selected',f=>f.properties.id===selected);paths.filter(f=>f.properties.id===selected).raise();},focus(id){const feature=world.features.find(f=>f.properties.id===id);if(!feature)return;const [[x0,y0],[x1,y1]]=path.bounds(feature);const k=Math.min(6,Math.max(1,.75/Math.max((x1-x0)/1000,(y1-y0)/600)));const tx=Math.max(1000*(1-k),Math.min(0,500-k*(x0+x1)/2)),ty=Math.max(600*(1-k),Math.min(0,300-k*(y0+y1)/2));svg.transition().duration(motion()).call(zoom.transform,d3.zoomIdentity.translate(tx,ty).scale(k));}};
}
