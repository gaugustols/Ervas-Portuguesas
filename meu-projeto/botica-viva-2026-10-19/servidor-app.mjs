import {createServer} from 'node:http';
import {readFile,realpath,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=await realpath(fileURLToPath(new URL('.',import.meta.url)));
const tipos={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.ttf':'font/ttf','.txt':'text/plain; charset=utf-8'};
createServer(async(req,res)=>{try{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(pathname==='/'){res.writeHead(302,{Location:'/app/'});return res.end()}
 if(!/^\/(app|pro)(\/|$)/.test(pathname))throw Error('Não disponível');
 let target=path.resolve(root,'.'+pathname);if((await stat(target)).isDirectory())target=path.join(target,'index.html');
 target=await realpath(target);const rel=path.relative(root,target);
 if(rel.startsWith('..')||path.isAbsolute(rel)||!['app','pro'].includes(rel.split(path.sep)[0]))throw Error('Não disponível');
 res.writeHead(200,{'Content-Type':tipos[path.extname(target)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-store'});res.end(await readFile(target));
}catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Recurso não encontrado')}}).listen(4174,'127.0.0.1',()=>console.log('Básico: http://127.0.0.1:4174/app/ · PRO: http://127.0.0.1:4174/pro/'));
