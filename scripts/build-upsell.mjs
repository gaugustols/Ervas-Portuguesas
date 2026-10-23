import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { UPSELL1_CHECKOUT_URL, UPSELL1_DECLINE_URL, UPSELL2_CHECKOUT_URL, UPSELL2_DECLINE_URL, DOWNSELL_CHECKOUT_URL, DOWNSELL_DECLINE_URL, FINAL_OFFER_CHECKOUT_URL, FINAL_OFFER_DECLINE_URL } from '../lib/upsell-config.mjs';

const escape = value => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function validateUrl(value, checkout = false) {
  if (!value && checkout) return '';
  if (typeof value !== 'string' || /[\u0000-\u0020\u007f]|%(?:0a|0d)/i.test(value)) throw new Error('Invalid upsell URL.');
  const url = new URL(value);
  const hosts = checkout ? ['pay.hotmart.com'] : ['ervasportuguesas.vercel.app', 'consumer.hotmart.com'];
  if (url.protocol !== 'https:' || !hosts.includes(url.hostname) || url.username || url.password || url.port || url.hash) throw new Error('Use the expected public HTTPS destination.');
  if (checkout && url.pathname === '/') throw new Error('A product checkout path is required.');
  if (!checkout && (url.search || url.pathname !== (url.hostname === 'consumer.hotmart.com' ? '/' : '/obrigado.html'))) throw new Error('The decline must lead to the existing plan chooser or Hotmart purchases.');
  return url.href;
}

function renderPage(templateName, label, checkoutUrl, declineUrl) {
  const checkout = validateUrl(checkoutUrl, true);
  const decline = validateUrl(declineUrl);
  const action = checkout
    ? `<a class="primary-button" id="upsell-purchase" href="${escape(checkout)}" rel="noopener noreferrer">${label}<span aria-hidden="true">→</span></a>`
    : `<button class="primary-button" id="upsell-purchase" type="button" disabled aria-describedby="purchase-unavailable">${label}</button>\n        <p class="upsell-unavailable" id="purchase-unavailable">Compra indisponível de momento.</p>`;
  const template = readFileSync(new URL(`../templates/${templateName}.html`, import.meta.url), 'utf8');
  return template.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
    if (key === 'PURCHASE_ACTION') return action;
    if (key === 'DECLINE_URL') return escape(decline);
    throw new Error(`Unknown upsell placeholder: ${key}`);
  }).replace(/[ \t]+$/gm, '');
}

export function renderUpsell1({ checkoutUrl = '', declineUrl = UPSELL1_DECLINE_URL } = {}) {
  return renderPage('upsell-1', 'Acrescenta agora à tua Botica Viva', checkoutUrl, declineUrl);
}

export function renderUpsell2({ checkoutUrl = '', declineUrl = UPSELL2_DECLINE_URL } = {}) {
  return renderPage('upsell-2', 'SIM! QUERO CUIDAR DA MINHA HORTA POR €7,90', checkoutUrl, declineUrl);
}

export function renderDownsell({ checkoutUrl = '', declineUrl = DOWNSELL_DECLINE_URL } = {}) {
  return renderPage('downsell', 'SIM! QUERO COMEÇAR COM UM VASO POR €4,90', checkoutUrl, declineUrl);
}

export function renderFinalOffer({ checkoutUrl = '', declineUrl = FINAL_OFFER_DECLINE_URL } = {}) {
  return renderPage('oferta-final', 'SIM! QUERO A MINHA BOTICA ORGANIZADA POR €3,90', checkoutUrl, declineUrl);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  writeFileSync(new URL('../upsell-1.html', import.meta.url), renderUpsell1({ checkoutUrl: UPSELL1_CHECKOUT_URL }));
  writeFileSync(new URL('../upsell-2.html', import.meta.url), renderUpsell2({ checkoutUrl: UPSELL2_CHECKOUT_URL }));
  writeFileSync(new URL('../downsell.html', import.meta.url), renderDownsell({ checkoutUrl: DOWNSELL_CHECKOUT_URL }));
  writeFileSync(new URL('../oferta-final.html', import.meta.url), renderFinalOffer({ checkoutUrl: FINAL_OFFER_CHECKOUT_URL }));
  console.log('Upsell 1 generated; purchase ' + (UPSELL1_CHECKOUT_URL ? 'enabled with its own checkout.' : 'disabled until its own checkout is configured.'));
  console.log('Upsell 2 generated; purchase ' + (UPSELL2_CHECKOUT_URL ? 'enabled with its own checkout.' : 'disabled until its own checkout is configured.'));
  console.log('Downsell generated; purchase ' + (DOWNSELL_CHECKOUT_URL ? 'enabled with its own checkout.' : 'disabled until its own checkout is configured.'));
  console.log('Final offer generated; purchase ' + (FINAL_OFFER_CHECKOUT_URL ? 'enabled with its own checkout.' : 'disabled until its own checkout is configured.'));
}
