const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3000;
const WS = '/workspace';

http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  let fp;
  if (url === '/' || url === '/index' || url === '/index.html') {
    fp = path.join(WS, 'drafts', 'index.plain.html');
  } else if (url === '/nav.plain.html') {
    fp = path.join(WS, 'drafts', 'nav.plain.html');
  } else if (url === '/footer.plain.html') {
    fp = path.join(WS, 'drafts', 'footer.plain.html');
  } else {
    fp = path.join(WS, url);
  }
  const ext = path.extname(fp);
  const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon','.svg':'image/svg+xml','.woff2':'font/woff2'};
  
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not Found: ' + url); return; }
    res.writeHead(200, {'Content-Type': types[ext]||'text/plain','Access-Control-Allow-Origin':'*'});
    if (fp.includes('index.plain.html')) {
      res.end(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>QVC</title><link rel="preconnect" href="https://qvc.scene7.com"><link rel="stylesheet" href="/styles/styles.css"><link rel="stylesheet" href="/styles/lazy-styles.css"><link rel="stylesheet" href="/styles/fonts.css"><script src="/scripts/aem.js" type="module"></script><script src="/scripts/scripts.js" type="module"></script></head><body><header></header><main>${data.toString()}</main><footer></footer></body></html>`);
    } else { res.end(data); }
  });
}).listen(PORT, () => console.log('Server at http://localhost:' + PORT));
