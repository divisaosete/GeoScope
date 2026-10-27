import assert from 'node:assert/strict';
import {start} from '../js/app.js';
import {loadJSON} from '../js/utils.js';
// Importing app links all static imports, but must not start or access the DOM.
assert.equal(typeof start,'function');
const originalFetch=globalThis.fetch;
globalThis.document={baseURI:'http://localhost/labs/geoscope/index.html'};
try {
 globalThis.fetch=async()=>new Response('{}',{status:404});
 await assert.rejects(loadJSON('./data/world.geojson'),/HTTP 404/);
 globalThis.fetch=async()=>new Response('<html>Not JSON</html>',{status:200});
 await assert.rejects(loadJSON('./data/countries.json'),/JSON inválido.*countries\.json/);
 globalThis.fetch=(_url,{signal})=>new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError')),{once:true}));
 await assert.rejects(loadJSON('./data/world.geojson',{timeoutMs:10}),/Tempo limite.*world\.geojson/);
 globalThis.fetch=async url=>{assert.equal(url.href,'http://localhost/labs/geoscope/data/countries.json');return new Response('{"ok":true}');};
 assert.deepEqual(await loadJSON('./data/countries.json'),{ok:true});
} finally {globalThis.fetch=originalFetch;delete globalThis.document;}
console.log('PASS: module graph links without side effects; HTTP, malformed JSON and timeout errors; subdirectory resolution.');
