import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { WEBAPP_ACCESS_URL, SUPPORT_URL } from '../lib/thank-you-config.mjs';

const PURCHASES_URL = 'https://consumer.hotmart.com/';
const SUPPORT_HELP = 'https://suportehotmart.zendesk.com/hc/pt-br/articles/360000649492-Como-entro-em-contato-com-o-Produtor';

function publicUrl(value, { allowEmail = false } = {}) {
  if (!value) return '';
  if (/[\u0000-\u0020\u007f]|%(?:0a|0d)/i.test(value)) throw new Error('The configured URL must not contain whitespace or control characters.');
  const url = new URL(value);
  if (allowEmail && url.protocol === 'mailto:' && /^[^\s@?]+@[^\s@?]+\.[^\s@?]+$/.test(url.pathname) && !url.search && !url.hash) return url.href;
  if (url.protocol !== 'https:' || url.username || url.password || url.port ||
      !url.hostname.includes('.') || /^(localhost|127\.|0\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(url.hostname)) {
    throw new Error('Use a public HTTPS URL without credentials, or leave the setting empty.');
  }
  return url.href;
}

export function renderThankYou({ accessUrl = '', supportUrl = '' } = {}) {
  const access = publicUrl(accessUrl);
  const support = publicUrl(supportUrl, { allowEmail: true });
  const values = {
    ACCESS_TITLE: access ? 'Abra o seu webapp.' : 'Consulte a sua compra.',
    ACCESS_DESCRIPTION: access ? 'Aceda à Botica Viva e siga as orientações para começar a sua primeira ficha.' : 'Encontre os detalhes e as informações de entrega na sua conta Hotmart.',
    ACCESS_LABEL: access ? 'Abrir o meu webapp' : 'Ver a minha compra na Hotmart',
    ACCESS_URL: access || PURCHASES_URL,
    ACCESS_NOTE: access ? 'Guarde a ligação nos favoritos para voltar quando quiser.' : 'Utilize o mesmo e-mail com que fez a compra.',
    SUPPORT_URL: support || SUPPORT_HELP,
    SUPPORT_LABEL: support ? 'Contactar o apoio' : 'Como pedir apoio',
    SUPPORT_DESCRIPTION: support ? 'Se precisar de ajuda para abrir o seu plano, entre em contacto com o apoio da Botica Viva.' : 'Veja como contactar o produtor através dos detalhes da sua compra na Hotmart.',
  };
  const escape = text => text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const template = readFileSync(new URL('../templates/obrigado.html', import.meta.url), 'utf8');
  return template.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
    if (!(key in values)) throw new Error(`Unknown thank-you placeholder: ${key}`);
    return escape(values[key]);
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  writeFileSync(new URL('../obrigado.html', import.meta.url), renderThankYou({ accessUrl: WEBAPP_ACCESS_URL, supportUrl: SUPPORT_URL }));
  console.log(WEBAPP_ACCESS_URL ? 'Thank-you page generated with configured webapp access.' : 'Thank-you page generated with Hotmart purchase fallback; webapp access not configured.');
}
