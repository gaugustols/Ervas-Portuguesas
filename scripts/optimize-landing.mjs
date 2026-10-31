import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const page = new URL('../index.html', import.meta.url);
let html = readFileSync(page, 'utf8');
const css = await build({
  entryPoints: [fileURLToPath(new URL('../styles/landing.css', import.meta.url))],
  bundle: true, minify: true, write: false, target: ['chrome100', 'safari15'],
  legalComments: 'none',
});
// Full CSS + HTML remains below the 50 KB compressed transfer budget.
const stylesheet = css.outputFiles[0].text.replace(/<\/style/gi, '<\\/style');
html = html.replace(/<style id="landing-critical-css">[\s\S]*?<\/style>\s*/g, '');
html = html.replace(/<link\b[^>]*rel="stylesheet"[^>]*href="assets\/nova-pagina\/css\/(?:styles|fonts|hook-question|rating-summary|landing-theme)\.css"[^>]*>\s*/g, '');
html = html.replace(/<link\b[^>]*rel="preconnect"[^>]*href="https:\/\/(?:connect.facebook.net|www.facebook.com)"[^>]*>\s*/g, '');
const preloads = html.match(/<link\b(?=[^>]*rel="preload")(?=[^>]*as="image")[^>]*>/g) ?? [];
html = html.replace(/<link\b(?=[^>]*rel="preload")(?=[^>]*as="image")[^>]*>\s*/g, '');
const pixel = html.match(/<!-- Meta Pixel Code -->[\s\S]*?<!-- End Meta Pixel Code -->/)?.[0];
if (!pixel || (html.match(/fbq\('init'/g) ?? []).length !== 1) throw new Error('Expected one existing Meta base pixel.');
html = html.replace(pixel, '');
const critical = `${pixel}\n<link rel="preconnect" href="https://connect.facebook.net" crossorigin>\n<link rel="preconnect" href="https://www.facebook.com" crossorigin>\n${[...new Set(preloads)].join('\n')}\n<style id="landing-critical-css">${stylesheet}</style>\n`;
html = html.replace(/(<meta name="viewport"[^>]*>)/, `$1\n${critical}`);
html = html.replace(/(?:\r?\n)[\t ]*(?=\r?\n)/g, '');
writeFileSync(page, html);
console.log(`Landing optimised: ${Buffer.byteLength(stylesheet)} bytes of inline CSS; one early async Meta SDK; system fonts.`);
