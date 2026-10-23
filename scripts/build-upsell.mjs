import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { UPSELL1_CHECKOUT_URL, UPSELL1_DECLINE_URL } from '../lib/upsell-config.mjs';

const escape = value => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function validateUrl(value, checkout = false) {
  if (!value && checkout) return '';
  if (typeof value !== 'string' || /[\u0000-\u0020\u007f]|%(?:0a|0d)/i.test(value)) throw new Error('Invalid upsell URL.');
  const url = new URL(value);
  const host = checkout ? 'pay.hotmart.com' : 'ervasportuguesas.vercel.app';
  if (url.protocol !== 'https:' || url.hostname !== host || url.username || url.password || url.port || url.hash) throw new Error('Use the expected public HTTPS destination.');
  if (checkout && url.pathname === '/') throw new Error('A product checkout path is required.');
  if (!checkout && (url.pathname !== '/obrigado.html' || url.search)) throw new Error('The decline must lead to the existing plan chooser.');
  return url.href;
}

export function renderUpsell1({ checkoutUrl = '', declineUrl = UPSELL1_DECLINE_URL } = {}) {
  const checkout = validateUrl(checkoutUrl, true);
  const decline = validateUrl(declineUrl);
  const label = 'Acrescenta agora à tua Botica Viva';
  const action = checkout
    ? `<a class="primary-button" id="upsell-purchase" href="${escape(checkout)}" rel="noopener noreferrer">${label}<span aria-hidden="true">→</span></a>`
    : `<button class="primary-button" id="upsell-purchase" type="button" disabled aria-describedby="purchase-unavailable">${label}</button>\n        <p class="upsell-unavailable" id="purchase-unavailable">Compra indisponível de momento.</p>`;
  const template = readFileSync(new URL('../templates/upsell-1.html', import.meta.url), 'utf8');
  return template.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
    if (key === 'PURCHASE_ACTION') return action;
    if (key === 'DECLINE_URL') return escape(decline);
    throw new Error(`Unknown upsell placeholder: ${key}`);
  }).replace(/[ \t]+$/gm, '');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  writeFileSync(new URL('../upsell-1.html', import.meta.url), renderUpsell1({ checkoutUrl: UPSELL1_CHECKOUT_URL }));
  console.log('Upsell 1 generated; purchase ' + (UPSELL1_CHECKOUT_URL ? 'enabled with its own checkout.' : 'disabled until its own checkout is configured.'));
}
