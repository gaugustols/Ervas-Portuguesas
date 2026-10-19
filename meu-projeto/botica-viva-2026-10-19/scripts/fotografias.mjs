// Aquisição editorial: descarrega só imagens com licença aberta confirmada.
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {ervas} from '../src/conteudo.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const pasta=root+'media/'; await mkdir(pasta,{recursive:true});
const headers={'User-Agent':'BoticaVivaEducationalGuide/1.0 (botanical study; source attribution included)'};
const pausa=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const json=async url=>{for(let tentativa=0;tentativa<5;tentativa++){const r=await fetch(url,{headers});if(r.status===429){await pausa(Math.max(10000,Number(r.headers.get('retry-after')||10)*1000));continue}if(!r.ok)throw Error(`${r.status}: ${url}`);return r.json()}throw Error('Limite de pedidos: '+url)};
let creditos={};try{creditos=JSON.parse(await readFile(pasta+'creditos.json','utf8'))}catch{}
const desenho=/K.hler|Medizinal|illustration|drawing|atlas|Woodwill/i;
const escolhidas={'erva-3':'Peppermint Plant.jpg','erva-18':'Zingiber officinale fresh rhizome.JPG','erva-21':'Allium sativum 003.JPG'};
for(const erva of ervas){
 const escolhida=escolhidas[erva.id];
 if(creditos[erva.id]&&creditos[erva.id].autor&&!desenho.test(decodeURIComponent(creditos[erva.id].pagina))&&(!escolhida||decodeURIComponent(creditos[erva.id].pagina).replaceAll('_',' ').endsWith(escolhida)))continue;
 const summary=await json('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(erva.pagina));
 if(!summary.originalimage)throw Error('Sem fotografia: '+erva.nome);
 const source=new URL(summary.originalimage.source); source.search='';
 const filename=escolhida||decodeURIComponent(source.pathname.split('/').at(source.pathname.includes('/thumb/')?-2:-1));
 const api=new URL('https://commons.wikimedia.org/w/api.php');
 Object.entries({action:'query',format:'json',prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:erva.id==='erva-32'?'240':'480',titles:'File:'+filename}).forEach(([k,v])=>api.searchParams.set(k,v));
 let info=Object.values((await json(api)).query.pages)[0]?.imageinfo?.[0];
 let meta=info?.extmetadata||{},license=meta.LicenseShortName?.value||'';
 if(!info||!/CC BY|Public domain|CC0/i.test(license)||(!meta.Artist?.value&&!/Public domain|CC0/i.test(license))||desenho.test(filename)){
  await pausa(2500);
  const search=new URL('https://commons.wikimedia.org/w/api.php');
  Object.entries({action:'query',format:'json',generator:'search',gsrsearch:'"'+erva.especie.replace(' × ',' ')+'" filetype:bitmap -intitle:Köhler -intitle:Woodwill -intitle:Medizinal -intitle:illustration',gsrnamespace:'6',gsrlimit:'12',prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'480'}).forEach(([k,v])=>search.searchParams.set(k,v));
  const alternatives=Object.values((await json(search)).query?.pages||{}).filter(x=>!desenho.test(x.title)).map(x=>x.imageinfo?.[0]).filter(Boolean);
  info=alternatives.find(x=>/CC BY|Public domain|CC0/i.test(x.extmetadata?.LicenseShortName?.value||'')&&(x.extmetadata?.Artist?.value||/Public domain|CC0/i.test(x.extmetadata?.LicenseShortName?.value||'')));
  if(!info)throw Error('Sem alternativa de licença aberta: '+filename);
  meta=info.extmetadata||{};license=meta.LicenseShortName.value;
 }
 const url=info.thumburl||info.url;
 const r=await fetch(url,{headers});if(!r.ok)throw Error('Fotografia: '+r.status);
 const bytes=Buffer.from(await r.arrayBuffer());
 if(bytes.length>300*1024)throw Error('Fotografia demasiado pesada: '+filename);
 const ext=r.headers.get('content-type')?.includes('png')?'png':r.headers.get('content-type')?.includes('webp')?'webp':'jpg';
 await writeFile(pasta+erva.id+'.'+ext,bytes);
 creditos[erva.id]={ficheiro:erva.id+'.'+ext,autor:meta.Artist?.value||'Autor não indicado; imagem em domínio público.',licenca:license,licencaUrl:(meta.LicenseUrl?.value||'https://commons.wikimedia.org/wiki/Commons:Licensing').replace(/^http:/,'https:'),pagina:info.descriptionurl,original:info.url,data:'2026-10-19',alteracao:'Redimensionamento automático pelo Wikimedia Commons; enquadramento CSS na aplicação.'};
 await writeFile(pasta+'creditos.json',JSON.stringify(creditos,null,2)+'\n');
 console.log(erva.nome+' · '+license+' · '+Math.round(bytes.length/1024)+' KB');
 await pausa(2200);
}
