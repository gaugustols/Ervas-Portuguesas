import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
function renderWidgetPage(templateName) {
  const template = readFileSync(new URL(`../templates/${templateName}.html`, import.meta.url), 'utf8').replace(/\r\n?/g, '\n');
  const initializer = template.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  if (!initializer) throw new Error('Hotmart widget initializer missing.');
  const hash = createHash('sha256').update(initializer).digest('base64');
  return template.replace('{{HOTMART_INIT_HASH}}', hash).replace(/[ \t]+$/gm, '');
}

export function renderUpsell1() {
  return renderWidgetPage('upsell-1');
}

export function renderUpsell2() {
  return renderWidgetPage('upsell-2');
}

export function renderDownsell() {
  return renderWidgetPage('downsell');
}

export function renderFinalOffer() {
  return renderWidgetPage('oferta-final');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  writeFileSync(new URL('../upsell-1.html', import.meta.url), renderUpsell1());
  writeFileSync(new URL('../upsell-2.html', import.meta.url), renderUpsell2());
  writeFileSync(new URL('../downsell.html', import.meta.url), renderDownsell());
  writeFileSync(new URL('../oferta-final.html', import.meta.url), renderFinalOffer());
  console.log('Upsell 1 generated with the official Hotmart Sales Funnel widget.');
  console.log('Upsell 2, Downsell and Final Offer generated with the same official widget.');
}
