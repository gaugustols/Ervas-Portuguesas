import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { brotliCompressSync } from 'node:zlib';
import vm from 'node:vm';

const html = readFileSync('index.html', 'utf8');
assert.equal((html.match(/fbq\('init', '891065599076214'\)/g) ?? []).length, 1);
assert.equal((html.match(/fbq\('track', 'PageView'\)/g) ?? []).length, 1);
assert.ok(html.indexOf("fbq('track'") < html.indexOf('<style'));
assert.equal((html.match(/id="landing-critical-css"/g) ?? []).length, 1);
assert.ok(!/<link[^>]+rel="stylesheet"/.test(html));
assert.ok(!html.includes('@font-face'));
assert.ok(html.includes('.hero .sub-h1.hook-question-answer{animation:none;opacity:1;transform:none}'), 'Subheadline must override the legacy delayed animation');
assert.ok(!html.includes('<iframe'));
assert.ok(!html.includes('maxresdefault.jpg'));
assert.ok(html.includes('vsl-poster-480.webp'));
assert.ok(brotliCompressSync(Buffer.from(html)).length < 50000);
assert.equal(readFileSync('public/index.html', 'utf8'), html);

const loaded = [];
const context = { document: { createElement: () => ({}), getElementsByTagName: () => [{ parentNode: { insertBefore: node => loaded.push(node) } }] } };
context.window = context;
const pixel = html.match(/<!-- Meta Pixel Code -->\s*<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(pixel);
vm.runInNewContext(pixel, context);
assert.deepEqual(Array.from(context.fbq.queue, args => Array.from(args)), [['init', '891065599076214'], ['track', 'PageView']]);
assert.equal(loaded.length, 1);
assert.equal(loaded[0].src, 'https://connect.facebook.net/en_US/fbevents.js');
assert.equal(loaded[0].async, true);

let ownJavaScript = 0;
for (const [, attrs, code] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
  const src = attrs.match(/src="([^"]+)"/)?.[1];
  if (!src) { new vm.Script(code); continue; }
  assert.ok(/defer|type="module"/.test(attrs), 'No blocking own script');
  const js = readFileSync(src, 'utf8');
  new vm.Script(js);
  ownJavaScript += statSync(src).size;
}
assert.ok(ownJavaScript < 30000);
assert.ok(statSync('assets/nova-pagina/js/vsl-player.js').size < 4000);
assert.ok(statSync('assets/nova-pagina/js/faq.js').size < 8000);
assert.ok(!readFileSync('lib/landing-reveals.ts', 'utf8').includes('add(".hero'));

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173/';
const response = await fetch(base);
assert.equal(response.status, 200);
assert.equal((await response.text()).replace(/\r\n/g, '\n'), html.replace(/\r\n/g, '\n'));
const paths = new Set([...html.matchAll(/<(?:img|script)\b[^>]*?src="(assets\/[^"?#]+)"/g)].map(match => match[1]));
for (const asset of paths) assert.equal((await fetch(new URL(asset, base))).status, 200, asset);
for (const path of ['AGENTS.md', '.env', '.git/config', 'meu-projeto/ATIVO.md', 'scripts/optimize-landing.mjs']) assert.equal((await fetch(new URL(path, base))).status, 404, path);
console.log('Passed: one early async Meta pixel, one PageView, no blocking CSS/own JS or fonts, reserved local poster, no initial iframe, exact export, payload budgets, ' + paths.size + ' HTTP assets and private paths 404.');
