import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {ervas,pro} from '../src/conteudo.mjs';
import {plantasComplementares} from '../src/plantas-complementares.mjs';
const root=new URL('../',import.meta.url),out=new URL('revisao-local/',root);await mkdir(out,{recursive:true});
assert.equal(new Set(ervas.map(e=>e.especie)).size,38);
const ids=plantasComplementares.map(p=>ervas.find(e=>e.especie===p.especie)?.id);assert.equal(new Set(ids).size,10);
const old=JSON.parse(await readFile(new URL('scripts/fixtures/plantas-originais.json',root),'utf8'));
for(const e of old){const now=ervas.find(n=>n.id===e.id);assert.equal(now.especie,e.especie);assert.equal(now.uso,e.uso);assert.ok(now.cuidado.includes(e.cuidado));}
for(const plan of ['app','pro']){
 const data=JSON.parse((await readFile(new URL(plan+'/index.html',root),'utf8')).match(/<script id="conteudo" type="application\/json">(.*?)<\/script>/s)[1]);
 assert.equal(Boolean(data.pro),plan==='pro');
 for(const id of ids){const e=data.ervas.find(e=>e.id===id);assert.ok(e.descricao&&e.beneficios&&e.preparacao.passos.length);assert.ok(e.credito.autor&&e.credito.pagina);assert.ok(e.foto.endsWith('.webp')&&e.fotoPequena.endsWith('.webp'));for(const f of [e.foto,e.fotoPequena]){const r=await fetch('http://127.0.0.1:4174/'+plan+'/'+f);assert.equal(r.status,200);const b=Buffer.from(await r.arrayBuffer());assert.equal(b.toString('ascii',8,12),'WEBP');}}
}
const tabs=await(await fetch('http://127.0.0.1:9233/json')).json(),ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});
let serial=0;const pending=new Map(),errors=[];ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p?.[1](Error(JSON.stringify(m.error))):p?.[0](m.result)}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails)};
const call=(method,params={})=>new Promise((r,j)=>{const id=++serial;pending.set(id,[r,j]);ws.send(JSON.stringify({id,method,params}));setTimeout(()=>{if(pending.has(id)){pending.delete(id);j(Error(method+' timeout'))}},15000).unref()});
const evaluate=async expression=>{const r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
try{
 await call('Runtime.enable');await call('Page.enable');
 for(const plan of ['app','pro']){
 await call('Page.navigate',{url:'http://127.0.0.1:4174/'+plan+'/'});await pause(300);
 for(const alias of ['Babosa','Plectranthus amboinicus','Hortelã-grosso','Mastruz','Boldo-do-Chile']){
 await evaluate(`location.hash='plantas'`);await pause(70);
 await evaluate(`{const input=document.getElementById('pesquisa-plantas');input.value=${JSON.stringify(alias)};input.dispatchEvent(new Event('input'))}`);
 assert.equal(await evaluate('document.querySelectorAll(".plant").length'),1,alias);
 }
 for(const width of [375,768,1440]){
 await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width===375});
 for(const id of ids){
 await evaluate(`location.hash='plantas/${id}'`);await pause(60);
 assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth'),plan+' '+width+' '+id);
 assert.equal(await evaluate('document.querySelectorAll(".plant-detail ol li").length>0'),true);
 assert.ok(await evaluate('document.querySelector(".plant-detail img").srcset.includes("480w")'));
 await evaluate('document.querySelector(".plant-detail img").decode()');
 assert.ok(await evaluate('document.querySelector(".plant-detail img").naturalWidth>0'));
 assert.ok(await evaluate('document.querySelector(".credit").textContent.includes("WebP")'));
 }
 if(plan==='app'&&[375,1440].includes(width)){
 for(const id of ['erva-34','erva-38']){
 await evaluate(`location.hash='plantas/${id}'`);await pause(80);await evaluate('document.fonts.ready; window.scrollTo(0,0)');
 const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});await writeFile(new URL(id+'-'+width+'.png',out),Buffer.from(shot.data,'base64'));
 }
 }
 }
 }
 assert.deepEqual(errors,[]);
 console.log('PASSOU: 10 fichas em ambos os planos, sem duplicação nem perda de conteúdo, 20 WebP por plano, nomes alternativos pesquisáveis, detalhes e imagens em 375/768/1440 px, sem erros JavaScript.');
}finally{ws.close()}
