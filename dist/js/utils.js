export const $ = id => document.getElementById(id);
export const normalize = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
export const escapeHTML = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const available = r => r?.status==='available' && Number.isFinite(r.value) && r.value>=0 && Number.isInteger(r.year);
export function number(n,compact=false){return new Intl.NumberFormat('pt-BR',{notation:compact?'compact':'standard',maximumFractionDigits:compact?2:0}).format(n);}
export function value(r,key,compact=false){if(!available(r))return 'Dados não disponíveis';return `${['gdp','gdppc'].includes(key)?'US$ ':''}${number(r.value,compact)}${key==='area'?' km²':''}`;}
export function reference(r){return available(r)?`${r.year} · ${escapeHTML(r.unit)} · <a href="https://data.worldbank.org/indicator/${encodeURIComponent(r.indicator)}" target="_blank" rel="noreferrer">Banco Mundial / WDI ↗</a>`:'Sem observação validada para 2023';}
export async function loadJSON(path,{timeoutMs=15000}={}){
 const url=new URL(path,document.baseURI),controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(),timeoutMs);
 try{
  const res=await fetch(url,{cache:'no-store',signal:controller.signal});
  if(!res.ok)throw new Error(`Falha ao carregar ${url.pathname} (HTTP ${res.status}).`);
  try{return await res.json();}catch(error){if(error.name==='AbortError')throw error;throw new Error(`JSON inválido em ${url.pathname}. Verifique se o servidor retornou dados, em vez de uma página HTML. ${error.message}`);}
 }catch(error){if(error.name==='AbortError')throw new Error(`Tempo limite ao carregar ${url.pathname}. Verifique o servidor e tente novamente.`);throw error;}
 finally{clearTimeout(timer);}
}
export const motion = () => matchMedia('(prefers-reduced-motion: reduce)').matches?0:500;
