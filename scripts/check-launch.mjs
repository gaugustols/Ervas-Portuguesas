import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {plantasComplementares} from '../meu-projeto/botica-viva-2026-10-19/src/plantas-complementares.mjs';
const origin=process.env.WEBAPP_TEST_ORIGIN||'http://127.0.0.1:4173';
const html=await readFile('index.html','utf8');
const text=html.replace(/<(script|style|svg)\b[^>]*>[\s\S]*?<\/\1>/gi,'').replace(/<[^>]*>/g,' ');
for(const forbidden of [/Dalva Vieira/i,/Brígida Moreira/i,/Recebi o livro/i,/cura natural/i,/curar ansiedade/i,/resolve isso em poucos dias/i,/Quase esgotado/i,/3\.000\+ utilizadores/i,/data-offer-countdown/])assert.ok(!forbidden.test(text+' '+html),String(forbidden));
const markup=html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,'').replace(/<!--[\s\S]*?-->/g,'');
const stack=[],voids=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
for(const m of markup.matchAll(/<\/?([a-z][\w-]*)\b[^>]*>/gi)){
 const tag=m[1].toLowerCase();if(voids.has(tag)||m[0].endsWith('/>'))continue;
 if(m[0][1]==='/')assert.equal(stack.pop(),tag,'Fecho HTML fora de ordem');else stack.push(tag);
}
assert.deepEqual(stack,[],'Elementos HTML por fechar');
assert.ok(text.includes('ferramenta digital de consulta de plantas e preparações caseiras'));
assert.ok(text.includes('38 fichas')&&text.includes('72 temas'));
assert.ok(text.includes('Acesso vitalício')&&text.includes('Garantia de 7 dias'));
assert.equal((html.match(/<h1\b/g)||[]).length,1);
assert.equal((html.match(/data-checkout-plan="/g)||[]).length,2);
for(const [plan,code] of [['basic','dv3haixa'],['pro','uszcskzv']])assert.match(html,new RegExp('href="https://pay\\.hotmart\\.com/P108062599Y\\?off='+code+'"[^>]*data-checkout-plan="'+plan+'"|data-checkout-plan="'+plan+'"[^>]*href="https://pay\\.hotmart\\.com/P108062599Y\\?off='+code+'"'));
assert.equal((html.match(/fbq\('init', '960754960438995'\)/g)||[]).length,1);
assert.equal((html.match(/fbq\('track', 'PageView'\)/g)||[]).length,1);
const tabs=[...html.matchAll(/data-preview-topic="([^"]+)"/g)].map(m=>m[1]);
const panels=[...html.matchAll(/data-preview-panel="([^"]+)"/g)].map(m=>m[1]);
assert.equal(tabs.length,5);assert.deepEqual(tabs,panels);
const resources=new Set(['/']);
for(const m of html.matchAll(/(?:href|src)="(assets\/[^"?#]+)"/g))resources.add('/'+m[1]);
for(const file of [...resources].filter(f=>f.endsWith('.css'))){const css=await readFile(file.slice(1),'utf8');for(const m of css.matchAll(/url\(['"]?([^)'"?#]+)['"]?\)/g)){if(!m[1].startsWith('data:')&&!m[1].startsWith('http'))resources.add(new URL(m[1],origin+file).pathname);}}
for(const path of resources)assert.equal((await fetch(origin+path)).status,200,path);
for(const plan of ['app','pro']){
 const app=await readFile(`meu-projeto/botica-viva-2026-10-19/${plan}/index.html`,'utf8');
 const data=JSON.parse(app.match(/<script id="conteudo" type="application\/json">(.*?)<\/script>/s)[1]);
 assert.equal(data.ervas.length,38);assert.equal(data.modulos.length,6);assert.equal(data.temas.length,72);assert.equal(data.metodos.length,6);
 assert.equal(Boolean(data.pro),plan==='pro');
 if(data.pro){assert.equal(data.pro.infusoes.length,8);assert.equal(data.pro.cultivo.length,6);assert.equal(data.pro.fichas.length,4);}
 assert.equal(plantasComplementares.length,10);
 for(const p of plantasComplementares){const e=data.ervas.find(e=>e.especie===p.especie);assert.ok(e&&e.descricao&&e.beneficios&&e.modoUsar&&e.cuidado&&e.preparacao.passos.length);for(const f of [e.foto,e.fotoPequena]){assert.ok(f);assert.ok((await stat(`meu-projeto/botica-viva-2026-10-19/${plan}/${f}`)).size>0);assert.equal((await fetch(origin+'/'+plan+'/'+f)).status,200);}}
 for(const id of tabs)assert.ok(data.ervas.some(e=>e.id===id));
 assert.equal((await fetch(origin+'/'+plan+'/')).status,200);
 const runtime=await readFile(`meu-projeto/botica-viva-2026-10-19/${plan}/assets/app.js`,'utf8');
 assert.ok(runtime.includes('O meu percurso'));assert.ok(!runtime.includes('A minha trilha'));
}
for(const path of ['/obrigado.html','/obrigado-basico.html','/obrigado-pro.html'])assert.equal((await fetch(origin+path)).status,200,path);
console.log('PASSOU: oferta digital, CTAs, Pixel preservado, amostra coerente, dez plantas e fotos, quantidades dos dois planos, acesso HTTP e '+resources.size+' recursos da landing.');
console.log('Não testa pagamento, e-mail, prazo de acesso, suporte do produtor ou apresentação num telemóvel real.');
