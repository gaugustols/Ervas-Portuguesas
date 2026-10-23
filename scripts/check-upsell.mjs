import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderUpsell1 } from './build-upsell.mjs';
import { UPSELL1_CHECKOUT_URL } from '../lib/upsell-config.mjs';

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

// Native HTTP checks; no browser interaction is claimed by this script.
const origin = process.env.PREVIEW_ORIGIN || 'http://127.0.0.1:4173';
const response = await fetch(origin + '/upsell-1.html?approved=true&plano=pro&checkout=https://other.example/');
assert.equal(response.status, 200);
assert.equal(await response.text(), html, 'Query strings cannot activate purchase or change destinations');
const resources = new Set();
for (const match of html.matchAll(/href="(assets\/[^"#]+)"/g)) resources.add(new URL(match[1], origin + '/upsell-1.html').href);
for (const url of resources) {
  const resource = await fetch(url);
  assert.equal(resource.status, 200, url);
  if (url.endsWith('.css')) {
    const css = await resource.text();
    for (const match of css.matchAll(/url\(['"]?([^'"\s)]+)['"]?\)/g)) resources.add(new URL(match[1], url).href);
  }
}
assert.equal((await fetch(origin + '/obrigado.html')).status, 200);
for (const path of ['/lib/upsell-config.mjs', '/templates/upsell-1.html', '/AGENTS.md', '/.git/config']) assert.equal((await fetch(origin + path)).status, 404, path);
console.log('Passed: static page, disabled/configured purchase, safe URLs, non-blocking refusal, query isolation, noindex, export and ' + resources.size + ' HTTP resources. Browser validation not included.');
