import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Script } from 'node:vm';
import { renderUpsell1, renderUpsell2, renderDownsell, renderFinalOffer } from './build-upsell.mjs';

const pages = [
  { name: 'upsell-1', render: renderUpsell1, price: '€9,50', offerLabel: 'CONDIÇÃO ESPECIAL APÓS A TUA COMPRA' },
  { name: 'upsell-2', render: renderUpsell2, price: '€7,90', offerLabel: 'COMPLEMENTO PARA A TUA NOVA HORTA' },
  { name: 'downsell', render: renderDownsell, price: '€4,90', offerLabel: 'UMA FORMA MAIS SIMPLES DE COMEÇAR' },
  { name: 'oferta-final', render: renderFinalOffer, price: '€3,90', offerLabel: 'ÚLTIMO COMPLEMENTO DESTA COMPRA' },
];
const sdk = 'https://checkout.hotmart.com/lib/hotmart-checkout-elements.js';
const origin = process.env.PREVIEW_ORIGIN || 'http://127.0.0.1:4173';
const resources = new Set();

for (const page of pages) {
  const html = readFileSync(`${page.name}.html`, 'utf8');
  assert.equal(html, page.render(), `${page.name}: deterministic generation`);
  assert.equal(readFileSync(`public/${page.name}.html`, 'utf8'), html);
  assert.match(html, /lang="pt-PT"/);
  assert.match(html, /name="robots" content="noindex, nofollow, noarchive"/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.ok(!/<form\b|<img\b|\{\{[A-Z_]+\}\}/.test(html));
  assert.equal(html.match(/<p class="upsell-price"[^>]*>([^<]+)<\/p>/)?.[1], page.price);
  assert.equal(html.match(/<p class="upsell-reference">([^<]+)<\/p>/)?.[1], page.offerLabel);
  assert.doesNotMatch(html, /<del\b|<s\b/i, `${page.name}: no crossed-out reference price`);
  assert.equal((html.match(/id="hotmart-sales-funnel"/g) || []).length, 1);
  const offer = html.match(/<section class="access-card upsell-offer"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(offer?.includes('<div id="hotmart-sales-funnel"></div>'), `${page.name}: widget in CTA card`);

  const scripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 2, 'One SDK script and one initializer per page');
  assert.equal(scripts[0][1], ` src="${sdk}"`);
  assert.equal(scripts[1][1], '');
  assert.ok(html.indexOf('id="hotmart-sales-funnel"') < scripts[0].index);
  assert.match(scripts[1][2], /^\s*checkoutElements\.init\('salesFunnel'\)\.mount\('#hotmart-sales-funnel'\);\s*$/);
  const calls = [];
  new Script(scripts[1][2], { filename: `${page.name}-inline.js` }).runInNewContext({
    checkoutElements: { init(kind) { calls.push(kind); return { mount(selector) { calls.push(selector); } }; } },
  });
  assert.deepEqual(calls, ['salesFunnel', '#hotmart-sales-funnel']);

  const hash = createHash('sha256').update(scripts[1][2]).digest('base64');
  const policy = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1];
  assert.ok(policy);
  const directives = Object.fromEntries(policy.split(';').map(value => value.trim()).filter(Boolean).map(value => {
    const [name, ...values] = value.split(/\s+/); return [name, values];
  }));
  assert.deepEqual(directives, {
    'default-src': ["'none'"],
    'script-src': [sdk, `'sha256-${hash}'`],
    'frame-src': ['https://pay.hotmart.com'],
    'style-src': ["'self'"],
    'font-src': ["'self'"],
    'img-src': ["'self'", 'data:'],
    'base-uri': ["'none'"],
    'form-action': ["'none'"],
  }, `${page.name}: exact CSP, no broad permissions`);
  assert.ok(!/<button\b|id="upsell-purchase"|upsell-decline|purchase-unavailable/.test(html));
  const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(links, ['#conteudo'], `${page.name}: no manual acceptance or refusal destinations`);
  assert.equal(page.render({ checkoutUrl: 'https://other.example/', declineUrl: 'https://other.example/' }), html);

  const response = await fetch(`${origin}/${page.name}.html?approved=true&checkout=https://other.example/`);
  assert.equal(response.status, 200);
  assert.equal(await response.text(), html, `${page.name}: server does not rewrite payment context`);
  for (const match of html.matchAll(/href="(assets\/[^"#]+)"/g)) resources.add(new URL(match[1], origin + '/').href);
}

for (const url of resources) {
  const resource = await fetch(url);
  assert.equal(resource.status, 200, url);
  if (url.endsWith('.css')) {
    const css = await resource.text();
    for (const match of css.matchAll(/url\(['"]?([^'"\s)]+)['"]?\)/g)) resources.add(new URL(match[1], url).href);
  }
}
assert.equal((await fetch(origin + '/obrigado.html')).status, 200);
for (const path of ['/lib/upsell-config.mjs', '/templates/upsell-1.html', '/templates/upsell-2.html', '/templates/downsell.html', '/templates/oferta-final.html', '/AGENTS.md', '/.git/config']) {
  assert.equal((await fetch(origin + path)).status, 404, path);
}
console.log(`Passed: ${pages.length} pages; one widget per CTA, script order, single initialization, exact CSP, prices, no manual payment/refusal actions, deterministic export and ${resources.size} HTTP resources. Browser/Hotmart transactions not included.`);
