// Testes do conteúdo e do motor num DOM mínimo em memória; não substituem QA visual.
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const source=await readFile(new URL('src/app.js',root),'utf8');
const original=JSON.parse(await readFile(new URL('scripts/fixtures/plantas-originais.json',root),'utf8'));
const base=process.env.WEBAPP_TEST_ORIGIN||'http://127.0.0.1:4173';

function dom(data,saved){
 class Element {
  constructor(tag){this.tagName=tag;this.attrs={};this.children=[];this.events={};this.value='';}
  setAttribute(k,v){this.attrs[k]=v;if(k==='value')this.value=v;}
  getAttribute(k){return this.attrs[k];}
  addEventListener(k,v){this.events[k]=v;}
  append(...items){this.children.push(...items);if(this.tagName==='select'&&!this.value&&items[0])this.value=items[0].value||items[0].textContent;}
  prepend(...items){this.children.unshift(...items);}
  replaceChildren(...items){this.children=[];this.append(...items);}
  set textContent(v){this.children=[String(v)];}
  get textContent(){return this.children.map(x=>typeof x==='string'?x:x.textContent).join('');}
  querySelectorAll(selector){const test=selector[0]==='.'?n=>(n.attrs.class||'').split(' ').includes(selector.slice(1)):n=>n.tagName===selector;return this.children.flatMap(n=>typeof n==='string'?[]:[...(test(n)?[n]:[]),...n.querySelectorAll(selector)]);}
  querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
  scrollIntoView(options){this.scrolled=options;}
  focus(){document.activeElement=this;}
 }
 const document={createElement:t=>new Element(t),createTextNode:t=>String(t),title:''};
 // Pesquisa recursiva por ID, sem depender dos seletores usados pelo motor.
 const find=(nodes,id)=>{for(const e of nodes){if(typeof e==='string')continue;if(e.attrs.id===id)return e;const nested=find(e.children,id);if(nested)return nested;}return null;};
 const all=['conteudo','principal','aviso','navegacao','top-progress','abrir-fontes'].map(id=>{const e=new Element('div');e.attrs.id=id;return e;});
 document.getElementById=id=>find(all,id);
 document.getElementById('conteudo').textContent=JSON.stringify(data);
 const window={events:{},addEventListener(k,v){this.events[k]=v;},scrollTo(){}};
 const location={hash:'#plantas'};
 const storage=new Map(saved?[[`botica-viva:1:${data.plano}`,saved]]:[]);
 const context=vm.createContext({document,window,location,Node:Element,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},DOMParser:class{parseFromString(t){return{body:{textContent:t.replace(/<[^>]*>/g,'')}}}},matchMedia:()=>({matches:true}),setTimeout:()=>1,clearTimeout(){},console});
 new vm.Script(source).runInContext(context);
 return{document,window,location,storage,main:document.getElementById('principal'),goto(hash){location.hash=hash;window.events.hashchange();}};
}

for(const plan of ['app','pro']){
 const html=await readFile(new URL(plan+'/index.html',root),'utf8');
 const data=JSON.parse(html.match(/<script id="conteudo" type="application\/json">(.*?)<\/script>/s)[1]);
 assert.equal(data.ervas.length,38);
 assert.equal(Boolean(data.pro),plan==='pro');
 assert.equal(data.modulos.length,6);assert.equal(data.temas.length,72);
 for(const old of original){const now=data.ervas.find(e=>e.id===old.id);assert.equal(now.especie,old.especie);assert.equal(now.uso,old.uso);assert.ok(now.cuidado.includes(old.cuidado));}
 const resources=new Set(['index.html','assets/styles.css','assets/app.js','assets/fonts/plus-jakarta-sans-400.ttf','assets/fonts/plus-jakarta-sans-600.ttf']);
 for(const e of data.ervas){
  for(const field of ['nome','especie','resumo','descricao','beneficios','modoUsar','cuidado','cuidadosGerais'])assert.ok(e[field]?.trim(),e.nome+': '+field);
  assert.ok(e.preparacao.passos.length>=3,e.nome+': preparação completa');
  assert.ok(Array.isArray(e.preparacao.ingredientes));
  for(const i of e.referencias)assert.ok(data.fontes[i]?.[1].startsWith('https://'));
  for(const file of [e.foto,e.fotoPequena].filter(Boolean))resources.add(file);
  assert.ok(e.credito.autor&&e.credito.licenca);
 }
 const louro=data.ervas.find(e=>e.nome==='Louro');
 assert.match(louro.beneficios,/não avaliou chá/);
 assert.match(louro.modoUsar,/Não use para ajustar a glicemia/);
 assert.match(louro.cuidado,/Retire sempre as folhas inteiras/);
 assert.equal(data.ervas.find(e=>e.nome==='Mastruz').preparacao.ingredientes.length,0);
 assert.deepEqual(data.ervas.find(e=>e.nome==='Aloé').preparacao.ingredientes,['Gel cosmético de Aloe vera identificado para uso cutâneo']);
 const saved=JSON.stringify({favoritos:['erva-10'],fichas:[],modulos:{m1:'Ficha existente de louro'},rascunho:{titulo:'O meu rascunho'},evidencias:{},dispensadas:['pro']});
 const ui=dom(data,saved);
 const search=ui.document.getElementById('pesquisa-plantas');
 search.value='Laurus nobilis';search.events.input();
 assert.equal(ui.main.querySelectorAll('.plant').length,1);
 assert.match(ui.main.querySelector('.plant').textContent,/Louro/);
 search.value='relaxamento';search.events.input();assert.ok(ui.main.querySelectorAll('.plant').length>=1);
 search.value='hortela';search.events.input();assert.equal(ui.main.querySelectorAll('.plant').length,3);
 search.value='zzzz-inexistente';search.events.input();assert.equal(ui.main.querySelectorAll('.plant').length,0);
 assert.match(ui.main.querySelector('.empty').textContent,/Não há plantas/);
 for(const e of data.ervas){
  ui.goto('#plantas/'+e.id);
  const sections=ui.main.querySelectorAll('.plant-section');assert.equal(sections.length,4,e.nome);
  assert.deepEqual(sections.map(s=>s.querySelector('h2').textContent),['01Para que é usada','02Modo de preparar','03Modo de usar','04Cuidados']);
  assert.ok(ui.main.textContent.includes(e.beneficios));assert.ok(ui.main.textContent.includes(e.modoUsar));
  assert.ok(ui.main.querySelectorAll('ol')[0].children.length>=3);
  const shortcuts=ui.main.querySelectorAll('.plant-shortcut');assert.equal(shortcuts.length,4);
  shortcuts[3].events.click();assert.equal(ui.document.activeElement.attrs.id,'planta-cuidados');
  assert.equal(ui.location.hash,'#plantas/'+e.id,'Atalho não interfere com o router');
 }
 ui.goto('#plantas/erva-13');
 const camomila=data.ervas.find(e=>e.id==='erva-13');
 assert.equal(camomila.nome,'Camomila');
 assert.equal(camomila.beneficiosDetalhados.length,5);
 const utilizacoes=ui.document.getElementById('planta-utilizacoes');
 const itens=utilizacoes.querySelectorAll('li');
 assert.equal(itens.length,5,'Camomila apresenta cinco utilizações em lista');
 for(const [i,item] of camomila.beneficiosDetalhados.entries()){
  assert.equal(itens[i].querySelector('strong').textContent,item.titulo+': ');
  assert.ok(itens[i].textContent.includes(item.texto));
 }
 ui.goto('#plantas/erva-10');
 assert.match(ui.main.textContent,/Nos meus favoritos/,'Favoritos anteriores preservados');
 ui.main.querySelectorAll('button').find(b=>b.textContent==='Criar ficha desta planta →').events.click();
 assert.equal(ui.location.hash,'#ferramenta');
 const persisted=JSON.parse(ui.storage.get(`botica-viva:1:${data.plano}`));
 assert.equal(persisted.rascunho.erva,'erva-10');assert.equal(persisted.rascunho.titulo,'O meu rascunho');
 assert.equal(persisted.modulos.m1,'Ficha existente de louro');
 for(const file of resources){assert.ok((await stat(new URL(plan+'/'+file,root))).size>0);const response=await fetch(`${base}/${plan}/${file}`);assert.equal(response.status,200,`${plan}/${file}`);}
 console.log(`${plan}: 38 fichas completas, quatro blocos renderizados, pesquisa, atalhos/foco, favoritos, rascunho, progresso e ${resources.size} recursos HTTP — PASSOU.`);
}
console.log('Validação num DOM em memória; responsividade e aspeto visual não verificados num navegador real.');
