import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const original = readFileSync('original.html', 'utf8');
const variant = readFileSync('teste-ervas.html', 'utf8');
const tracking = readFileSync('assets/nova-pagina/js/conversion-events.js', 'utf8');
assert.equal(readFileSync('public/teste-ervas.html', 'utf8'), variant, 'Variant included in static deployment export');
const primary = readFileSync('index.html', 'utf8');
assert.equal(primary, variant.replace('<meta name="robots" content="noindex, follow">\n', ''));
assert.equal(readFileSync('public/index.html', 'utf8'), primary);
assert.equal(readFileSync('public/original.html', 'utf8'), original);
assert.ok(!primary.includes('name="robots" content="noindex'));
for (const html of [original, variant, primary]) {
  assert.equal((html.match(/fbq\('init', '891065599076214'\)/g) || []).length, 1);
  assert.equal((html.match(/fbq\('track', 'PageView'\)/g) || []).length, 1);
  assert.equal((html.match(/src="assets\/nova-pagina\/js\/conversion-events.js"/g) || []).length, 1);
}
assert.ok(original.includes('Despesas na farmácia'));
assert.ok(variant.includes('Tens ervas na cozinha, mas só sabes fazer chá com elas?'));
assert.ok(variant.includes('Descobre receitas tradicionais portuguesas e aprende novas formas de aproveitar as plantas que já conheces.'));
assert.ok(original.includes('data-checkout-plan="basic"'), 'Basic retained in original');
assert.ok(!variant.includes('data-checkout-plan="basic"'), 'Homologation targets PRO only');
assert.ok(!original.includes('js/checkout-attribution.js'), 'Original attribution behavior unchanged');
const content = readFileSync('meu-projeto/botica-viva-2026-10-19/src/fichas-plantas.mjs', 'utf8');
for (const example of ['Hortelã-verde na salada', 'Tomilho nos legumes', 'Orégãos no molho de tomate']) {
  assert.ok(content.includes(example)); assert.ok(variant.includes(example));
}
// Analytics errors or a blocked/missing pixel cannot break checkout navigation.
for (const fbq of [undefined, () => { throw Error('Pixel blocked'); }]) {
  let click;
  const sandbox = { window: { fbq }, document: { body: { dataset: {} }, addEventListener: (_, fn) => { click = fn; } }, URL };
  vm.runInNewContext(tracking, sandbox);
  const link = { dataset: { checkoutPlan: 'pro', ctaId: 'test' }, getAttribute: key => key === 'href' ? 'https://pay.hotmart.com/P108062599Y?off=uszcskzv&checkoutMode=10' : null, hasAttribute: () => false, href: 'https://pay.hotmart.com/P108062599Y?off=uszcskzv&checkoutMode=10' };
  click({ target: { closest: () => link }, preventDefault() { throw Error('Navigation intercepted'); } });
}
console.log('Static invariants passed: original preserved, one existing pixel/PageView, real product examples, no navigation interception.');
if (!process.argv.includes('--browser')) process.exit(0);

// Playwright is supplied by the cloud runtime; no dependency or lockfile changes.
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.PREVIEW_ORIGIN || 'http://127.0.0.1:4180';
const output = process.env.CONVERSION_TEST_OUTPUT || '/tmp/ervas-conversion-tests';
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
const results = [];
try {
  for (const width of [360, 390, 768, 1366]) {
    for (const path of ['/original.html', '/', '/teste-ervas.html']) {
      const context = await browser.newContext({ viewport: { width, height: 800 }, deviceScaleFactor: width < 600 ? 2 : 1, isMobile: width < 600, hasTouch: true, reducedMotion: 'reduce' });
      // Local deterministic telemetry capture; never send synthetic events to Meta.
      await context.route('https://**/*', async route => {
        if (route.request().url().endsWith('/fbevents.js')) {
          return route.fulfill({ contentType: 'application/javascript', body: 'window.__metaCalls=[];window.fbq.callMethod=function(...args){window.__metaCalls.push(args)};for(const args of window.fbq.queue)window.fbq.callMethod(...args);window.fbq.queue=[];' });
        }
        return route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>External service isolated for local testing</title>' });
      });
      const page = await context.newPage();
      const errors = [];
      const badResponses = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('response', r => { if (r.url().startsWith(base) && r.status() >= 400) badResponses.push(r.url()); });
      const attribution = new URLSearchParams({ utm_source: 'meta', utm_medium: 'paid_social', utm_campaign: 'Ervas & tradição', utm_content: 'criativo=1', fbclid: 'test-click-id', src: 'meta-ad', sck: 'homologacao', off: 'must-not-override', checkoutMode: '999', email: 'must-not-forward@example.invalid' });
      await page.goto(base + path + '?' + attribution, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => window.__metaCalls?.some(args => args[1] === 'PageView'));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Overflow ${width} ${path}`);
      const calls = () => page.evaluate(() => window.__metaCalls);
      const count = async name => (await calls()).filter(args => args[1] === name).length;
      assert.equal((await calls()).filter(args => args[0] === 'init').length, 1); assert.equal(await count('PageView'), 1);
      assert.equal(await count('Pricing_View'), 0, 'Pricing not yet visible');
      const inventory = await page.locator('a, button').evaluateAll(elements => elements.map(el => ({ tag: el.tagName, text: el.getAttribute('aria-label') || el.textContent.trim(), href: el.getAttribute('href'), disabled: el.disabled || el.getAttribute('aria-disabled') === 'true' })));
      for (const { href } of inventory) {
        if (!href) continue;
        if (href.startsWith('#')) assert.ok(await page.locator(href).count(), `Missing target ${href}`);
        else if (!href.startsWith('https://')) assert.equal((await context.request.get(new URL(href, base).href)).status(), 200, href);
      }
      if (path !== '/original.html') {
        await page.addScriptTag({ content: readFileSync('assets/nova-pagina/js/checkout-attribution.js', 'utf8') });
        assert.equal(await page.locator('a.btn:not([data-checkout-plan="pro"])').count(), 0, 'Every test CTA opens PRO');
        const rect = await page.locator('.test-cta').boundingBox();
        assert.ok(rect.y >= 0 && rect.y + rect.height <= 800, `Test CTA below fold at ${width}`);
        assert.ok(await page.locator('.test-product img').evaluate(img => img.complete && img.naturalWidth > 0));
        await page.screenshot({ path: `${output}/test-${width}.png` });
      }
      // Audit original anchor CTAs by actual touch; checkout links are intercepted only by this test harness.
      for (const cta of await page.locator('a.btn[href^="#"]').all()) {
        const target = await cta.getAttribute('href');
        const before = await count('CTA_Click');
        await cta.tap();
        await page.waitForFunction(hash => location.hash === hash, target);
        assert.equal(await count('CTA_Click'), before + 1);
      }
      await page.locator('#oferta .plano-valor').first().scrollIntoViewIfNeeded();
      await page.waitForFunction(() => window.__metaCalls.some(args => args[1] === 'Pricing_View'));
      await page.locator('.hero').scrollIntoViewIfNeeded();
      await page.locator('#oferta .plano-valor').last().scrollIntoViewIfNeeded();
      assert.equal(await count('Pricing_View'), 1);
      // Loading the script twice must not attach duplicate handlers/observers.
      await page.addScriptTag({ content: tracking });
      await page.evaluate(() => document.addEventListener('click', e => { if (e.target.closest('a[data-checkout-plan]')) e.preventDefault(); }));
      for (const cta of await page.locator('a[data-checkout-plan]').all()) {
        const plan = await cta.getAttribute('data-checkout-plan');
        const destination = new URL(await cta.getAttribute('href'));
        assert.equal(destination.origin, 'https://pay.hotmart.com');
        assert.equal(destination.pathname, '/P108062599Y');
        assert.equal(destination.searchParams.get('off'), plan === 'pro' ? 'uszcskzv' : 'dv3haixa');
        assert.equal(destination.searchParams.get('checkoutMode'), '10');
        if (path !== '/original.html') {
          for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'fbclid', 'src', 'sck']) assert.equal(destination.searchParams.get(key), attribution.get(key), key);
          assert.equal(destination.searchParams.has('email'), false, 'No arbitrary personal query data forwarded');
          assert.equal(destination.searchParams.getAll('utm_source').length, 1);
        }
        const before = await count('Checkout_Click'), beforeCTA = await count('CTA_Click');
        await cta.tap();
        assert.equal(await count('Checkout_Click'), before + 1);
        assert.equal(await count('CTA_Click'), beforeCTA + 1);
        const event = (await calls()).filter(args => args[1] === 'Checkout_Click').at(-1);
        assert.equal(event[2].plan, plan); assert.equal(event[2].value, plan === 'pro' ? 14.9 : 7.9);
        assert.equal(event[2].currency, 'EUR'); assert.equal(event[2].lp_variant, path === '/original.html' ? 'original' : 'ervas-cozinha');
      }
      for (const faq of await page.locator('.faq-trigger').all()) {
        const before = await faq.getAttribute('aria-expanded'); await faq.tap();
        assert.notEqual(await faq.getAttribute('aria-expanded'), before);
      }
      const track = page.locator('[data-inside-track]');
      if (await page.locator('[data-inside-next]').isEnabled()) {
        await page.locator('[data-inside-next]').tap();
        await page.waitForFunction(() => document.querySelector('[data-inside-track]').scrollLeft > 2 && !document.querySelector('[data-inside-prev]').disabled);
        assert.equal(await page.locator('[data-inside-prev]').isEnabled(), true);
        await page.locator('[data-inside-prev]').tap();
        await page.waitForFunction(() => document.querySelector('[data-inside-track]').scrollLeft <= 2);
      } else assert.ok(await track.evaluate(el => el.scrollWidth <= el.clientWidth + 2));
      if (path === '/original.html') {
        await page.locator('.vsl-trigger').tap();
        assert.ok((await page.locator('#hero-vsl-root iframe').getAttribute('src')).startsWith('https://www.youtube-nocookie.com/embed/'));
      }
      assert.equal(await count('InitiateCheckout'), 0, 'Never infer external initiation from a local click');
      assert.equal(await count('Pricing_View'), 1);
      assert.deepEqual(errors, []); assert.deepEqual(badResponses, []);
      const payload = await page.evaluate(() => ({ html: performance.getEntriesByType('navigation')[0].decodedBodySize, resources: performance.getEntriesByType('resource').filter(r => r.name.startsWith(location.origin)).length }));
      results.push({ width, path, inventory, events: await calls(), payload, errors, badResponses });
      console.log(`Passed Chromium ${width}px ${path}: touch CTAs, plan links/events, single pricing view, FAQ, carousel, local assets, no horizontal overflow.`);
      await context.close();
    }
  }
  // With JavaScript disabled the test's primary CTA must still be a working native link.
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 800 } });
  await context.route('https://pay.hotmart.com/**', route => route.fulfill({ contentType: 'text/html', body: '<title>Checkout navigation target</title>' }));
  const page = await context.newPage(); await page.goto(base + '/');
  await page.locator('.test-cta').click();
  await page.waitForURL('https://pay.hotmart.com/**');
  assert.equal(new URL(page.url()).searchParams.get('off'), 'uszcskzv');
  console.log('Passed: native PRO navigation without JavaScript (destination intercepted; external checkout availability not asserted).');
  await context.close();
  writeFileSync(`${output}/results.json`, JSON.stringify(results, null, 2));
} finally { await browser.close(); }
