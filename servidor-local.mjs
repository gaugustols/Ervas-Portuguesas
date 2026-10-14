import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PREVIEW_PORT || 4173);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.webp': 'image/webp',
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
    // Servir somente a landing page e seus recursos; não expor pastas Git ou originais.
    if (relative !== 'index.html' && !relative.startsWith('assets/nova-pagina/')) {
      res.writeHead(404);
      res.end();
      return;
    }
    const file = fs.realpathSync(path.resolve(root, relative));
    const assetRoot = path.join(root, 'assets', 'nova-pagina') + path.sep;
    if (file !== path.join(root, 'index.html') && !file.startsWith(assetRoot)) {
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
