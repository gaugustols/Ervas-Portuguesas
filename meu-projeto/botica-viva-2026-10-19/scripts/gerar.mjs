import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import * as conteudo from '../src/conteudo.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const repo=fileURLToPath(new URL('../../../',import.meta.url));
const template=await readFile(root+'src/template.html','utf8');
const fotos=JSON.parse(await readFile(root+'media/creditos.json','utf8'));
for(const plano of ['Básico','PRO']){
 const dest=root+(plano==='PRO'?'pro/':'app/');
 await mkdir(dest+'assets/fonts',{recursive:true});await mkdir(dest+'assets/plantas',{recursive:true});
 for(const file of ['app.js','styles.css'])await copyFile(root+'src/'+file,dest+'assets/'+file);
 for(const file of ['plus-jakarta-sans-400.ttf','plus-jakarta-sans-600.ttf'])await copyFile(repo+'assets/nova-pagina/fonts/'+file,dest+'assets/fonts/'+file);
 const licenca=await readFile(repo+'assets/nova-pagina/fonts/LICENSE-plusjakartasans.txt','utf8');
 await writeFile(dest+'assets/fonts/LICENSE-plusjakartasans.txt',licenca.replace(/[ \t]+$/gm,''));
 const dados={titulo:'Botica Viva',plano,versao:1,fontes:conteudo.fontes,ervas:conteudo.ervas.map(e=>({...e,foto:'assets/plantas/'+fotos[e.id].ficheiro,fotoLargura:fotos[e.id].largura,fotoPequenaLargura:fotos[e.id].larguraPequena,fotoPequena:fotos[e.id].ficheiroPequeno?'assets/plantas/'+fotos[e.id].ficheiroPequeno:null,credito:fotos[e.id]})),modulos:conteudo.modulos,metodos:conteudo.metodos,temas:conteudo.temas,nutrientes:conteudo.nutrientes,modelos:conteudo.modelos,aromas:conteudo.aromas,
 ofertas:plano==='Básico'?[{id:'pro',titulo:'Mais espaço para a sua prática',gancho:'Já tem a sua primeira ficha. Quer organizar infusões, cultivo e registos para imprimir?',beneficios:['Caderno Ilustrado de Infusões','Guia de Cultivo e Conservação','Fichas Práticas para Imprimir'],preco:'€14,90',cta:'Conhecer o Plano PRO',link:'https://pay.hotmart.com/P108062599Y?off=uszcskzv',gatilho:{modulo:'m1'}}]:[],
 ...(plano==='PRO'?{pro:conteudo.pro}:{})};
 for(const foto of Object.values(fotos)){await copyFile(root+'media/'+foto.ficheiro,dest+'assets/plantas/'+foto.ficheiro);if(foto.ficheiroPequeno)await copyFile(root+'media/'+foto.ficheiroPequeno,dest+'assets/plantas/'+foto.ficheiroPequeno);}
 await writeFile(dest+'index.html',template.replaceAll('{{PLANO}}',plano.toUpperCase()).replace('{{CONTEUDO}}',JSON.stringify(dados).replaceAll('<','\\u003c')));
 console.log(`${plano}: ${dados.ervas.length} plantas, ${dados.temas.length} temas, ${dados.modulos.length} módulos.`);
}
