import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Script } from 'node:vm';
import { renderUpsell1, renderUpsell2, renderDownsell, renderFinalOffer } from './build-upsell.mjs';
import { UPSELL2_CHECKOUT_URL, DOWNSELL_CHECKOUT_URL, FINAL_OFFER_CHECKOUT_URL } from '../lib/upsell-config.mjs';

const html = readFileSync('upsell-1.html', 'utf8');
assert.equal(html, renderUpsell1());
assert.equal(readFileSync('public/upsell-1.html', 'utf8'), html);
assert.match(html, /lang="pt-PT"/);
assert.match(html, /name="robots" content="noindex, nofollow, noarchive"/);
assert.match(html, /default-src 'none'/);
assert.equal((html.match(/<h1\b/g) || []).length, 1);
assert.ok(!/<form\b|<img\b|\{\{[A-Z_]+\}\}/.test(html));
assert.ok(!html.includes('dv3haixa') && !html.includes('uszcskzv'), 'Never reuse the front-end checkouts');
assert.match(html, /De <del>€29,90<\/del> por:/);
assert.match(html, /€9,50/);

assert.equal((html.match(/id="hotmart-sales-funnel"/g) || []).length, 1);
const widgetScripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)];
assert.equal(widgetScripts.length, 2, 'One SDK script and one initializer');
assert.equal(widgetScripts[0][1], ' src="https://checkout.hotmart.com/lib/hotmart-checkout-elements.js"');
assert.equal(widgetScripts[1][1], '');
assert.ok(html.indexOf('id="hotmart-sales-funnel"') < widgetScripts[0].index);
assert.match(widgetScripts[1][2], /^\s*checkoutElements\.init\('salesFunnel'\)\.mount\('#hotmart-sales-funnel'\);\s*$/);
const widgetCalls = [];
new Script(widgetScripts[1][2], { filename: 'upsell-1-inline.js' }).runInNewContext({
  checkoutElements: { init(kind) { widgetCalls.push(kind); return { mount(selector) { widgetCalls.push(selector); } }; } },
});
assert.deepEqual(widgetCalls, ['salesFunnel', '#hotmart-sales-funnel']);
const widgetHash = createHash('sha256').update(widgetScripts[1][2]).digest('base64');
assert.ok(html.includes(`script-src https://checkout.hotmart.com/lib/hotmart-checkout-elements.js 'sha256-${widgetHash}'`));
assert.match(html, /frame-src https:\/\/pay\.hotmart\.com;/);
assert.match(html, /style-src-attr 'unsafe-inline'/);
assert.ok(!/<button\b|id="upsell-purchase"|upsell-decline|purchase-unavailable|href="https:\/\/(?:pay|consumer)\.hotmart\.com|href="https:\/\/ervasportuguesas\.vercel\.app\/obrigado.html"/.test(html), 'All purchase and decline actions belong to the widget');
assert.equal(renderUpsell1({ checkoutUrl: 'https://other.example/', declineUrl: 'https://other.example/' }), html, 'Legacy manual configuration cannot restore buttons');

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
assert.match(finalOffer, /SIM! QUERO A MINHA BOTICA ORGANIZADA POR €3,90/);
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
assert.equal(await response.text(), html, 'Server serves the static widget without rewriting visitor parameters');
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
console.log('Passed: official widget order, single mount, CSP hash, no manual actions, unchanged manual checkout validation on other pages, noindex, export and ' + resources.size + ' HTTP resources. Browser/Hotmart transaction validation not included.');
