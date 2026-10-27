/* Classic entry point: it can report module loading failures before app.js runs. */
(() => {
 const scriptURL = new URL(document.currentScript.src);
 const status = document.getElementById('status');
 const retry = document.getElementById('retry');
 const timeoutMs = 15000;

 function deadline(promise, message) {
  let timer;
  return Promise.race([
   promise,
   new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(message)), timeoutMs); })
  ]).finally(() => clearTimeout(timer));
 }

 function loadD3() {
  const url = new URL('../assets/d3.min.js', scriptURL);
  return deadline(new Promise((resolve, reject) => {
   const script = document.createElement('script');
   script.src = url.href;
   script.onload = () => {
    if (typeof window.d3?.geoEqualEarth !== 'function') {
     reject(new Error(`Biblioteca D3 inválida em ${url.pathname}.`));
    } else resolve();
   };
   script.onerror = () => reject(new Error(`Não foi possível carregar ${url.pathname}. Verifique o arquivo, a resposta HTTP e eventuais bloqueios do navegador.`));
   document.head.append(script);
  }), `Tempo limite ao carregar ${url.pathname}. Verifique o servidor local.`);
 }

 async function boot() {
  try {
   if (!['http:', 'https:'].includes(location.protocol)) {
    throw new Error('Abra index.html pelo Live Server ou por outro servidor HTTP/HTTPS; file:// não permite carregar os módulos e dados corretamente.');
   }
   await loadD3();
   const appURL = new URL('./app.js', scriptURL);
   let app;
   try {
    app = await deadline(import(appURL.href), 'Tempo limite ao carregar os módulos JavaScript. Verifique js/app.js e seus imports.');
   } catch (error) {
    throw new Error(`Falha ao carregar js/app.js ou um de seus imports (utils.js, map.js, layers.js, countries.js, compare.js, resources.js). Verifique respostas HTTP, tipo MIME JavaScript e o console. ${error.message}`);
   }
   if (typeof app.start !== 'function') throw new Error('js/app.js não exporta a função start(). Verifique se os arquivos são da mesma versão.');
   await app.start();
  } catch (error) {
   console.error('[GeoScope / inicialização]', error);
   status.textContent = `Não foi possível iniciar o GeoScope. ${error.message}`;
   document.querySelectorAll('#search,#layers,#zoom-in,#zoom-out,#reset,#country-a,#country-b,#swap,#clear,#resource-select').forEach(el => { el.disabled = true; });
   document.getElementById('country').innerHTML = '<h2>Aplicação não iniciada</h2><p>Consulte a mensagem acima. Depois de corrigir o arquivo ou o servidor, recarregue a aplicação.</p>';
   retry.textContent = 'Recarregar aplicação';
   retry.hidden = false;
   // Failed module graphs are cached by the browser; a reload starts a clean graph.
   retry.onclick = () => location.reload();
  }
 }
 boot();
})();
