import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { WEBAPP_ACCESS_URL, PRO_WEBAPP_ACCESS_URL, SUPPORT_URL } from '../lib/thank-you-config.mjs';

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

export function renderThankYou({ accessUrl = '', proAccessUrl = '', supportUrl = '', plan = '' } = {}) {
  const access = publicUrl(accessUrl);
  const proAccess = publicUrl(proAccessUrl);
  const support = publicUrl(supportUrl, { allowEmail: true });
  if (plan && !['Básico', 'PRO'].includes(plan)) throw new Error('Unknown plan.');
  if (proAccess && !access) throw new Error('A plan chooser requires both access URLs.');
  const escape = text => text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const values = {
    ACCESS_TITLE: proAccess ? 'Escolha o plano que adquiriu.' : access ? (plan ? `Abra o seu Plano ${plan}.` : 'Abra o seu webapp.') : 'Consulte a sua compra.',
    ACCESS_DESCRIPTION: proAccess ? 'Consulte a confirmação da compra e abra a versão correspondente ao seu plano.' : access ? 'Aceda à Botica Viva e siga as orientações para começar a sua primeira ficha.' : 'Encontre os detalhes e as informações de entrega na sua conta Hotmart.',
    ACCESS_LABEL: proAccess ? 'Abrir o Plano Básico' : access ? (plan ? `Abrir o Plano ${plan}` : 'Abrir o meu webapp') : 'Ver a minha compra na Hotmart',
    ACCESS_URL: access || PURCHASES_URL,
    SECONDARY_ACCESS: proAccess ? `<a class="secondary-button secondary-access" id="acesso-pro" href="${escape(proAccess)}" rel="noopener noreferrer">Abrir o Plano PRO<span aria-hidden="true">→</span></a>` : '',
    ACCESS_NOTE: access ? 'Guarde a ligação nos favoritos para voltar quando quiser.' : 'Utilize o mesmo e-mail com que fez a compra.',
    SUPPORT_URL: support || SUPPORT_HELP,
    SUPPORT_LABEL: support ? 'Contactar o apoio' : 'Como pedir apoio',
    SUPPORT_DESCRIPTION: support ? 'Se precisar de ajuda para abrir o seu plano, entre em contacto com o apoio da Botica Viva.' : 'Veja como contactar o produtor através dos detalhes da sua compra na Hotmart.',
  };
  const template = readFileSync(new URL('../templates/obrigado.html', import.meta.url), 'utf8');
  return template.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
    if (!(key in values)) throw new Error(`Unknown thank-you placeholder: ${key}`);
    return key === 'SECONDARY_ACCESS' ? values[key] : escape(values[key]);
  }).replace(/[ \t]+$/gm, '');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  for (const [file, options] of [
    ['obrigado.html', { accessUrl: WEBAPP_ACCESS_URL, proAccessUrl: PRO_WEBAPP_ACCESS_URL }],
    ['obrigado-basico.html', { accessUrl: WEBAPP_ACCESS_URL, plan: 'Básico' }],
    ['obrigado-pro.html', { accessUrl: PRO_WEBAPP_ACCESS_URL, plan: 'PRO' }],
  ]) writeFileSync(new URL('../' + file, import.meta.url), renderThankYou({ ...options, supportUrl: SUPPORT_URL }));
  console.log('Thank-you pages generated: common plan chooser and individual Basic/PRO access.');
}
