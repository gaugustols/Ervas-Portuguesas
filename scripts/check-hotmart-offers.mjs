// Consulta pública apenas: não introduz dados nem inicia pagamentos.
import assert from 'node:assert/strict';
const offers=[['Básico','dv3haixa',7.9],['PRO','uszcskzv',14.9]];
for(const [plan,code,value] of offers){
 const url='https://pay.hotmart.com/P108062599Y?off='+code;
 const response=await fetch(url,{signal:AbortSignal.timeout(20000)});
 assert.equal(response.status,200,plan+': checkout acessível');
 const html=await response.text();
 const json=html.match(/<script[^>]*id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)?.[1];
 assert.ok(json,'Dados públicos ausentes; a verificação precisa de revisão');
 const data=JSON.parse(json),get=i=>data[i];
 const product=data.find(item=>item&&typeof item==='object'&&'warrantyDays' in item&&'offer' in item);
 assert.ok(product,'Produto não identificado');
 const offer=get(product.offer);
 const methods=get(offer.paymentMethods).map(i=>{const m=get(i),amount=get(m.amount);return{method:get(m.type),value:get(amount.value),currency:get(amount.currency)};});
 assert.equal(get(product.id),8746348,plan+': ID do produto');
 assert.equal(get(product.name),'Botica Viva');
 assert.equal(get(product.warrantyDays),7);
 assert.ok(methods.some(m=>m.currency==='EUR'&&m.value===value),plan+': preço base em euros');
 assert.equal(get(product.physicalProduct),false,'Não deve ser produto físico');
 console.log(JSON.stringify({plan,url,productId:get(product.id),name:get(product.name),warrantyDays:get(product.warrantyDays),description:get(product.description),methods,checkedAt:new Date().toISOString(),paymentCompleted:false}));
}
