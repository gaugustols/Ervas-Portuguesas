// Testes de integração em Chrome isolado com CDP. Não lê o perfil do utilizador.
// Abrir Chrome headless com --remote-debugging-port=9233 e perfil temporário antes de executar.
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile,readdir,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import os from 'node:os';
const root=fileURLToPath(new URL('../',import.meta.url));
const base=process.env.WEBAPP_TEST_ORIGIN||'http://127.0.0.1:4173';
const temp=path.join(os.tmpdir(),'botica-viva-verificacao-'+Date.now());await mkdir(temp,{recursive:true});
for(const plano of ['app','pro']){
 const html=await readFile(root+plano+'/index.html','utf8');
 const data=JSON.parse(html.match(/<script id="conteudo" type="application\/json">(.*?)<\/script>/s)[1]);
 assert.equal(data.ervas.length,38);assert.equal(data.temas.length,72);assert.equal(data.modulos.length,6);
 assert.equal(Boolean(data.pro),plano==='pro','Conteúdo PRO deve ficar separado do Básico');
 const assets=['index.html','assets/styles.css','assets/app.js','assets/fonts/plus-jakarta-sans-400.ttf','assets/fonts/plus-jakarta-sans-600.ttf',...data.ervas.map(e=>e.foto)];
 for(const asset of assets){const r=await fetch(base+'/'+plano+'/'+asset);assert.equal(r.status,200,asset);assert.ok(Number(r.headers.get('content-length'))>0|| (await r.arrayBuffer()).byteLength>0);}
 data.ervas.forEach(e=>{assert.ok(e.credito.autor,'Autoria da fotografia: '+e.nome);assert.ok(!/NC|ND/.test(e.credito.licenca));assert.ok(e.credito.pagina.startsWith('https://commons.wikimedia.org/'));});
 assert.ok(!/<script[^>]+src="https?:/i.test(html));
}
assert.equal((await fetch(base+'/app/..%2fsrc/conteudo.mjs')).status,404,'Servidor não deve expor fontes');
const tabs=await (await fetch('http://127.0.0.1:9233/json')).json();
const tab=tabs.find(t=>t.type==='page'&&(t.url==='about:blank'||t.url.startsWith(base)));
assert.ok(tab,'Abra um navegador de teste isolado');
const ws=new WebSocket(tab.webSocketDebuggerUrl);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});
const pending=new Map(),errors=[],httpErrors=[];let serial=0;
ws.onmessage=event=>{const m=JSON.parse(event.data);if(m.id){const pair=pending.get(m.id);if(pair){pending.delete(m.id);m.error?pair[1](Error(JSON.stringify(m.error))):pair[0](m.result)}}else{if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')errors.push(m.params.args.map(a=>a.value).join(' '));if(m.method==='Network.responseReceived'&&m.params.response.status>=400)httpErrors.push(m.params.response.url)}};
const call=(method,params={})=>new Promise((resolve,reject)=>{const id=++serial;pending.set(id,[resolve,reject]);ws.send(JSON.stringify({id,method,params}));setTimeout(()=>{if(pending.has(id)){pending.delete(id);reject(Error('Tempo esgotado: '+method))}},15000).unref()});
async function evaluate(expression){const r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.text+': '+r.exceptionDetails.exception?.description);return r.result?.value}
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function goto(route){await evaluate(`location.hash=${JSON.stringify(route)}`);await pause(100)}
async function shot(name){await evaluate('document.fonts.ready');await pause(100);const s=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(path.join(temp,name+'.png'),Buffer.from(s.data,'base64'))}
async function viewport(width,height=900){await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});await pause(80)}
async function noOverflow(){assert.ok(await evaluate('document.documentElement.scrollWidth<=document.documentElement.clientWidth'),'Conteúdo a sair do ecrã: '+await evaluate('location.hash'))}
try{
 await call('Runtime.enable');await call('Page.enable');await call('Network.enable');
 await call('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:temp});
 await call('Page.navigate',{url:base+'/app/'});await pause(400);
 await evaluate(`localStorage.removeItem('botica-viva:1:Básico');localStorage.removeItem('botica-viva:1:PRO');location.reload()`);await pause(350);
 assert.equal(await evaluate('document.querySelectorAll("[data-offer]").length'),0);
 await viewport(1440);await shot('inicio-desktop');await noOverflow();
 await viewport(375,812);await shot('inicio-mobile');await noOverflow();
 assert.ok(await evaluate('document.querySelector(".hero .button").getBoundingClientRect().bottom < innerHeight'),'Primeiro CTA visível sem deslocar');
 await goto('trilha/m1');await evaluate(`document.getElementById('evidencia').value='Ainda não tenho ficha';document.querySelector('input[name=feito]').checked=true;document.querySelector('form').requestSubmit()`);
 assert.equal(await evaluate(`JSON.parse(localStorage.getItem('botica-viva:1:Básico')||'{}').modulos?.m1||null`),null,'Módulo 1 exige ficha');
 await goto('ferramenta');
 await evaluate(`for(const [id,value] of Object.entries({titulo:'Alecrim da cozinha',origem:'Produto alimentar identificado',instrucao:'Temperar legumes conforme utilização alimentar do produto',acao:'Conferir o rótulo no domingo'})){const f=document.getElementById(id);f.value=value;f.dispatchEvent(new Event('input',{bubbles:true}))}`);
 await call('Page.reload');await pause(250);assert.equal(await evaluate('document.getElementById("titulo").value'),'Alecrim da cozinha','Rascunho persistente');
 await evaluate(`document.querySelector('input[name=confirmacao]').checked=true;document.querySelector('form').requestSubmit()`);
 assert.equal(await evaluate(`JSON.parse(localStorage.getItem('botica-viva:1:Básico')).fichas.length`),1);
 await goto('trilha/m1');await evaluate(`const f=document.getElementById('evidencia');f.value='Alecrim da cozinha: não utilizar até esclarecer a identificação';f.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('input[name=feito]').checked=true;document.querySelector('form').requestSubmit()`);
 assert.equal(await evaluate('document.querySelectorAll("[data-offer]").length'),1);
 assert.equal(await evaluate('document.querySelector("[data-offer] a.button").href'),'https://pay.hotmart.com/P108062599Y?off=uszcskzv','Checkout PRO real');
 await call('Page.reload');await pause(250);assert.equal(await evaluate('document.querySelectorAll("[data-offer]").length'),1,'Oferta e progresso persistem');
 await evaluate(`[...document.querySelectorAll('button')].find(b=>b.textContent==='Agora não').click()`);
 await call('Page.reload');await pause(250);assert.equal(await evaluate('document.querySelectorAll("[data-offer]").length'),0,'Dispensa persistente');
 await goto('proximo');assert.equal(await evaluate('document.querySelectorAll("[data-offer]").length'),0);
 await goto('plantas');await evaluate(`const s=document.getElementById('pesquisa-plantas');s.value='hortela';s.dispatchEvent(new Event('input'))`);assert.equal(await evaluate('document.querySelectorAll(".plant").length'),3,'Pesquisa sem acentos');
 await evaluate('document.querySelector(".favourite").click()');await call('Page.reload');await pause(250);assert.equal(await evaluate(`JSON.parse(localStorage.getItem('botica-viva:1:Básico')).favoritos.length`),1);
 await goto('biblioteca/temas');await evaluate(`const s=document.querySelector('input[type=search]');s.value='insónia';s.dispatchEvent(new Event('input'))`);assert.equal(await evaluate('document.querySelectorAll("details").length'),1);
 await goto('painel');await shot('painel-mobile');await evaluate(`[...document.querySelectorAll('button')].find(b=>b.textContent==='Exportar todos os dados').click()`);await pause(200);
 let exported;for(let i=0;i<50&&!exported;i++){exported=(await readdir(temp)).find(f=>f.endsWith('.json'));if(!exported)await pause(100)}assert.ok(exported,'Download concluído em cinco segundos');assert.equal(JSON.parse(await readFile(path.join(temp,exported),'utf8')).dados.fichas.length,1,'Exportação inclui fichas reais');
 for(const width of [375,768,1440]){await viewport(width);for(const route of ['inicio','trilha','trilha/m1','plantas','plantas/erva-1','ferramenta','painel','biblioteca/guia','biblioteca/temas','biblioteca/nutrientes','biblioteca/modelos','biblioteca/aromas','fontes']){await goto(route);await noOverflow();}}
 await goto('plantas');await viewport(1440);await shot('plantas-desktop');
 await call('Page.navigate',{url:base+'/pro/'});await pause(350);assert.equal(await evaluate('document.querySelectorAll("[data-offer]").length'),0,'PRO não recebe outra oferta');
 await goto('pro');assert.equal(await evaluate('document.querySelectorAll(".plant").length'),8,'Oito fichas de infusão');await viewport(375);await noOverflow();await shot('pro-mobile');
 await goto('imprimir/0');await evaluate(`const f=document.getElementById('print-0');f.value='Alecrim';f.dispatchEvent(new Event('input'))`);await call('Page.reload');await pause(250);assert.equal(await evaluate('document.getElementById("print-0").value'),'Alecrim');
 await call('Emulation.setEmulatedMedia',{media:'print'});const pdf=await call('Page.printToPDF',{printBackground:false,paperWidth:8.27,paperHeight:11.69,marginTop:.4,marginBottom:.4,marginLeft:.4,marginRight:.4});await writeFile(path.join(temp,'ficha.pdf'),Buffer.from(pdf.data,'base64'));assert.ok((await stat(path.join(temp,'ficha.pdf'))).size>2000);await call('Emulation.setEmulatedMedia',{media:''});
 for(const width of [375,768,1440]){await viewport(width);for(const route of ['pro','imprimir/0','imprimir/1','imprimir/2','imprimir/3']){await goto(route);await noOverflow();}}
 assert.deepEqual(errors,[],'Console / erros JavaScript');assert.deepEqual(httpErrors,[],'Recursos HTTP');
 console.log('PASSOU: 38 fotografias por plano, 72 temas, separação PRO, recursos HTTP, 3 larguras, navegação, evidência, pesquisa, favoritos, rascunho, persistência, oferta/dispensa, exportação, impressão e console.');
 console.log('Capturas e PDF de teste (temporários): '+temp);
}finally{ws.close()}
