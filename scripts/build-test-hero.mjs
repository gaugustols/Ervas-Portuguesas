import { readFileSync, writeFileSync } from 'node:fs';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const original = readFileSync(new URL('index.html', root), 'utf8');
const pro = original.match(/<a\b[^>]*href="([^"]+)"[^>]*data-checkout-plan="pro"/)?.[1];
if (!pro || !original.includes('<header class="hero">')) throw Error('Original hero or existing PRO checkout missing');
const hero = `<header class="hero test-hero">
  <div class="container test-hero-layout">
    <div class="test-copy">
      <p class="test-brand">Botica Viva · Guia digital</p>
      <h1>Tens ervas na cozinha, mas só sabes fazer chá com elas?</h1>
      <p class="test-subtitle">Descobre receitas tradicionais portuguesas e aprende novas formas de aproveitar as plantas que já conheces.</p>
      <ul class="test-examples" aria-label="Três preparações incluídas">
        <li>Hortelã-verde na salada</li>
        <li>Tomilho nos legumes</li>
        <li>Orégãos no molho de tomate</li>
      </ul>
      <a class="btn test-cta" href="${pro}" data-checkout-plan="pro" data-cta-id="hero-primary">Quero o acesso PRO — €14,90</a>
      <p class="test-terms">Pagamento único · Acesso digital no telemóvel · Garantia de 7 dias</p>
    </div>
    <figure class="test-product">
      <div class="test-phone"><img src="assets/nova-pagina/images/aplicacao-real/mobile.webp" width="780" height="2200" alt="Ecrã real da Botica Viva no telemóvel, com consulta de plantas e preparações" fetchpriority="high" decoding="async"></div>
      <figcaption>O teu guia, sempre à mão. Ecrã real da aplicação.</figcaption>
    </figure>
  </div>
</header>`;
const css = await build({ entryPoints: [fileURLToPath(new URL('styles/test-hero.css', root))], minify: true, write: false });
const result = original
  .replace('<body>', '<body data-lp-variant="ervas-cozinha">')
  .replace(/<header class="hero">[\s\S]*?<\/header>/, hero)
  // Homologation is PRO-only; the original still offers both unchanged plans.
  .replace(/<article class="oferta-plano" aria-labelledby="plano-basico-titulo">[\s\S]*?<\/article>/, '')
  .replace(/<a\b([^>]*class="[^"]*\bbtn\b[^"]*"[^>]*)>[\s\S]*?<\/a>/g, (_match, attrs) => {
    const retained = attrs.replace(/\s(?:href|data-checkout-plan|aria-describedby)="[^"]*"/g, '');
    return `<a${retained} href="${pro}" data-checkout-plan="pro" aria-describedby="plano-pro-descricao">Quero o acesso PRO — €14,90</a>`;
  })
  .replace('<script src="assets/nova-pagina/js/conversion-events.js" defer></script>', '<script src="assets/nova-pagina/js/checkout-attribution.js" defer></script>\n<script src="assets/nova-pagina/js/conversion-events.js" defer></script>')
  .replace(/<link\b(?=[^>]*rel="preload")(?=[^>]*as="image")[^>]*>\s*/g, '')
  .replace('</head>', `<meta name="robots" content="noindex, follow">\n<style>${css.outputFiles[0].text}</style>\n</head>`);
writeFileSync(new URL('teste-ervas.html', root), result);
console.log('Test hero generated at teste-ervas.html; original and checkout preserved.');
