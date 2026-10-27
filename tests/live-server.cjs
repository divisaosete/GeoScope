// Test-only harness. Uses the user's installed Live Server engine without changing it.
// node tests/live-server.cjs /absolute/path/to/live-server
const path = require('node:path');
const engine = require(process.argv[2]);
const root = path.resolve(__dirname, '..');
const faults = ['import', 'd3', 'mime', 'json', 'http', 'timeout', 'resources'];
engine.start({
 port: 5501, host: '127.0.0.1', root, open: false, logLevel: 1,
 // Disable auto-refresh during reproducible tests and screenshot writes.
 watch: [],
 ignore: ['tests/**', 'dist/**'],
 mount: [...faults.map(name => [`/__fault/${name}`, root]), ['/labs/geoscope', path.join(root, 'dist')]],
 middleware: [(req, res, next) => {
  const url = req.url.split('?')[0];
  res.setHeader('Cache-Control', 'no-store');
  if (url === '/__fault/import/js/map.js' || url === '/__fault/d3/assets/d3.min.js' || url === '/__fault/http/data/world.geojson' || url === '/__fault/resources/data/resources.json') {
   res.writeHead(404); res.end('Intentional test failure'); return;
  }
  if (url === '/__fault/mime/js/map.js') {
   res.writeHead(200, {'Content-Type': 'text/html'}); res.end('<html>Wrong MIME test</html>'); return;
  }
  if (url === '/__fault/json/data/countries.json') {
   res.writeHead(200, {'Content-Type': 'application/json'}); res.end('{invalid'); return;
  }
  if (url === '/__fault/timeout/data/world.geojson') {
   // Leave the response pending so the real client timeout must abort it.
   return;
  }
  next();
 }]
});
