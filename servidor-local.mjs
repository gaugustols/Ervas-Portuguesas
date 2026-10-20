import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PREVIEW_PORT || 4173);
const pages = new Set(['index.html', 'obrigado.html', 'obrigado-basico.html', 'obrigado-pro.html']);
const webappRoot = path.join(root, 'meu-projeto', 'botica-viva-2026-10-19');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer((req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    res.end();
    return;
  }
  try {
    const url = new URL(req.url, 'http://localhost');
    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
    if (relative.includes('\\') || relative.split('/').includes('..')) {
      res.writeHead(404); res.end(); return;
    }
    if (['app', 'pro'].includes(relative)) {
      res.writeHead(308, { Location: '/' + relative + '/' + url.search }); res.end(); return;
    }
    const appMatch = relative.match(/^(app|pro)\/(.*)$/);
    if (appMatch) {
      const subpath = appMatch[2] || 'index.html';
      if (subpath !== 'index.html' && !subpath.startsWith('assets/')) { res.writeHead(404); res.end(); return; }
      const base = path.join(webappRoot, appMatch[1]);
      const file = fs.realpathSync(path.resolve(base, subpath));
      if (file !== path.join(base, 'index.html') && !file.startsWith(path.join(base, 'assets') + path.sep)) { res.writeHead(403); res.end(); return; }
      const data = fs.readFileSync(file);
      res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(req.method === 'HEAD' ? undefined : data); return;
    }
    // Servir somente a landing page e seus recursos; não expor pastas Git ou originais.
    if (!pages.has(relative) && !relative.startsWith('assets/nova-pagina/')) {
      res.writeHead(404);
      res.end();
      return;
    }
    const file = fs.realpathSync(path.resolve(root, relative));
    const assetRoot = path.join(root, 'assets', 'nova-pagina') + path.sep;
    if (![...pages].some(page => file === path.join(root, page)) && !file.startsWith(assetRoot)) {
      res.writeHead(403);
      res.end();
      return;
    }
    const data = fs.readFileSync(file);
    res.writeHead(200, {
      'Content-Type': mime[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch {
    res.writeHead(404);
    res.end('Arquivo não encontrado');
  }
});

server.listen(port, '127.0.0.1', () => console.log(`Landing page da raiz: http://127.0.0.1:${port}`));
process.on('SIGINT', () => server.close(() => process.exit(0)));
