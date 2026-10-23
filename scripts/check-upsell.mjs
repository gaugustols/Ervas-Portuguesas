import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderUpsell1, renderUpsell2, renderDownsell, renderFinalOffer } from './build-upsell.mjs';
import { UPSELL1_CHECKOUT_URL, UPSELL2_CHECKOUT_URL, DOWNSELL_CHECKOUT_URL, FINAL_OFFER_CHECKOUT_URL } from '../lib/upsell-config.mjs';

const html = readFileSync('upsell-1.html', 'utf8');
assert.equal(html, renderUpsell1({ checkoutUrl: UPSELL1_CHECKOUT_URL }));
assert.equal(readFileSync('public/upsell-1.html', 'utf8'), html);
assert.match(html, /lang="pt-PT"/);
assert.match(html, /name="robots" content="noindex, nofollow, noarchive"/);
assert.match(html, /default-src 'none'/);
assert.equal((html.match(/<h1\b/g) || []).length, 1);
assert.ok(!/<script\b|<form\b|<img\b|\{\{[A-Z_]+\}\}/.test(html));
assert.ok(!html.includes('dv3haixa') && !html.includes('uszcskzv'), 'Never reuse the front-end checkouts');
assert.match(html, /De <del>€29,90<\/del> por:/);
assert.match(html, /€9,50/);

const inactive = renderUpsell1();
assert.match(inactive, /<button[^>]*id="upsell-purchase"[^>]*disabled/);
assert.ok(!inactive.includes('href="https://pay.hotmart.com/'));
assert.match(inactive, /href="https:\/\/ervasportuguesas.vercel.app\/obrigado.html"/);
const configured = renderUpsell1({ checkoutUrl: 'https://pay.hotmart.com/EXAMPLE?off=offer&src=upsell1' });
assert.match(configured, /id="upsell-purchase" href="https:\/\/pay.hotmart.com\/EXAMPLE\?off=offer&amp;src=upsell1"/);
assert.ok(!configured.includes('purchase-unavailable'));
for (const checkoutUrl of ['#PLACEHOLDER-CHECKOUT', 'javascript:alert(1)', 'http://pay.hotmart.com/EXAMPLE', 'https://pay.hotmart.com.evil.example/EXAMPLE', 'https://user:pass@pay.hotmart.com/EXAMPLE', 'https://127.0.0.1/EXAMPLE', 'https://pay.hotmart.com/EXAMPLE%0a', 'https://pay.hotmart.com/']) {
  assert.throws(() => renderUpsell1({ checkoutUrl }));
}
for (const declineUrl of ['https://other.example/', 'https://ervasportuguesas.vercel.app/obrigado.html?approved=true', 'https://ervasportuguesas.vercel.app/pro/']) assert.throws(() => renderUpsell1({ declineUrl }));

const html2 = readFileSync('upsell-2.html', 'utf8');
assert.equal(html2, renderUpsell2({ checkoutUrl: UPSELL2_CHECKOUT_URL }));
assert.equal(readFileSync('public/upsell-2.html', 'utf8'), html2);
assert.match(html2, /De <del>€17,90<\/del> por:/);
assert.match(html2, /SIM! QUERO CUIDAR DA MINHA HORTA POR €7,90/);
assert.ok(!html2.includes('€4,90'), 'Confirmed price must be consistent');
assert.match(renderUpsell2(), /<button[^>]*id="upsell-purchase"[^>]*disabled/);
assert.match(html2, /href="https:\/\/consumer.hotmart.com\/"/);
assert.match(html2, /name="robots" content="noindex, nofollow, noarchive"/);
assert.ok(!/<script\b|<form\b|<img\b|\{\{[A-Z_]+\}\}/.test(html2));
const configured2 = renderUpsell2({ checkoutUrl: 'https://pay.hotmart.com/EXAMPLE2?off=offer2&src=upsell2' });
assert.match(configured2, /EXAMPLE2\?off=offer2&amp;src=upsell2/);
assert.ok(!configured2.includes('purchase-unavailable'));
assert.throws(() => renderUpsell2({ checkoutUrl: 'https://other.example/' }));
assert.throws(() => renderUpsell2({ declineUrl: 'https://consumer.hotmart.com/?redirect=other' }));

const downsell = readFileSync('downsell.html', 'utf8');
assert.equal(downsell, renderDownsell({ checkoutUrl: DOWNSELL_CHECKOUT_URL }));
assert.equal(readFileSync('public/downsell.html', 'utf8'), downsell);
assert.match(downsell, /De <del>€7,90<\/del> por:/);
assert.match(downsell, /SIM! QUERO COMEÇAR COM UM VASO POR €4,90/);
assert.match(downsell, /href="https:\/\/ervasportuguesas.vercel.app\/obrigado.html"/);
assert.match(downsell, /name="robots" content="noindex, nofollow, noarchive"/);
assert.match(renderDownsell(), /<button[^>]*id="upsell-purchase"[^>]*disabled/);
assert.ok(!/<script\b|<form\b|<img\b|\{\{[A-Z_]+\}\}/.test(downsell));
const configuredDownsell = renderDownsell({ checkoutUrl: 'https://pay.hotmart.com/EXAMPLE3?off=offer3&src=downsell' });
assert.match(configuredDownsell, /EXAMPLE3\?off=offer3&amp;src=downsell/);
assert.ok(!configuredDownsell.includes('purchase-unavailable'));
assert.throws(() => renderDownsell({ checkoutUrl: 'javascript:alert(1)' }));
assert.throws(() => renderDownsell({ declineUrl: 'https://other.example/' }));

const finalOffer = readFileSync('oferta-final.html', 'utf8');
assert.equal(finalOffer, renderFinalOffer({ checkoutUrl: FINAL_OFFER_CHECKOUT_URL }));
assert.equal(readFileSync('public/oferta-final.html', 'utf8'), finalOffer);
assert.match(finalOffer, /De <del>€9,90<\/del> por:/);
assert.match(finalOffer, /SIM! QUERO A MINHA BOTICA ORGANIZADA POR €3,70/);
assert.match(finalOffer, /href="https:\/\/consumer.hotmart.com\/"/);
assert.match(finalOffer, /name="robots" content="noindex, nofollow, noarchive"/);
assert.match(renderFinalOffer(), /<button[^>]*id="upsell-purchase"[^>]*disabled/);
assert.ok(!/<script\b|<form\b|<img\b|\{\{[A-Z_]+\}\}/.test(finalOffer));
const configuredFinal = renderFinalOffer({ checkoutUrl: 'https://pay.hotmart.com/EXAMPLE4?off=offer4&src=final' });
assert.match(configuredFinal, /EXAMPLE4\?off=offer4&amp;src=final/);
assert.ok(!configuredFinal.includes('purchase-unavailable'));
assert.throws(() => renderFinalOffer({ checkoutUrl: 'javascript:alert(1)' }));
assert.throws(() => renderFinalOffer({ declineUrl: 'https://consumer.hotmart.com/?redirect=other' }));

// Native HTTP checks; no browser interaction is claimed by this script.
const origin = process.env.PREVIEW_ORIGIN || 'http://127.0.0.1:4173';
const response = await fetch(origin + '/upsell-1.html?approved=true&plano=pro&checkout=https://other.example/');
assert.equal(response.status, 200);
assert.equal(await response.text(), html, 'Query strings cannot activate purchase or change destinations');
const response2 = await fetch(origin + '/upsell-2.html?approved=true&checkout=https://other.example/');
assert.equal(response2.status, 200);
assert.equal(await response2.text(), html2, 'Upsell 2 ignores visitor-supplied payment parameters');
const responseDownsell = await fetch(origin + '/downsell.html?approved=true&checkout=https://other.example/');
assert.equal(responseDownsell.status, 200);
assert.equal(await responseDownsell.text(), downsell, 'Downsell ignores visitor-supplied payment parameters');
const responseFinal = await fetch(origin + '/oferta-final.html?approved=true&checkout=https://other.example/');
assert.equal(responseFinal.status, 200);
assert.equal(await responseFinal.text(), finalOffer, 'Final offer ignores visitor-supplied payment parameters');
const resources = new Set();
for (const page of [html, html2, downsell, finalOffer]) {
  for (const match of page.matchAll(/href="(assets\/[^"#]+)"/g)) resources.add(new URL(match[1], origin + '/').href);
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
for (const path of ['/lib/upsell-config.mjs', '/templates/upsell-1.html', '/templates/upsell-2.html', '/templates/downsell.html', '/templates/oferta-final.html', '/AGENTS.md', '/.git/config']) assert.equal((await fetch(origin + path)).status, 404, path);
console.log('Passed: static page, disabled/configured purchase, safe URLs, non-blocking refusal, query isolation, noindex, export and ' + resources.size + ' HTTP resources. Browser validation not included.');
