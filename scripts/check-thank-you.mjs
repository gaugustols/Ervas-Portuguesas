import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { renderThankYou } from './build-thank-you.mjs';
import { WEBAPP_ACCESS_URL, PRO_WEBAPP_ACCESS_URL, SUPPORT_URL } from '../lib/thank-you-config.mjs';

const html = readFileSync('obrigado.html', 'utf8');
assert.equal(html, renderThankYou({ accessUrl: WEBAPP_ACCESS_URL, proAccessUrl: PRO_WEBAPP_ACCESS_URL, supportUrl: SUPPORT_URL }));
for (const [file, accessUrl, plan] of [['obrigado-basico.html', WEBAPP_ACCESS_URL, 'Básico'], ['obrigado-pro.html', PRO_WEBAPP_ACCESS_URL, 'PRO']]) {
  const variant = readFileSync(file, 'utf8');
  assert.equal(variant, renderThankYou({ accessUrl, plan, supportUrl: SUPPORT_URL }));
  assert.equal(readFileSync('public/' + file, 'utf8'), variant);
  assert.ok(!variant.includes('id="acesso-pro"'));
}
assert.match(html, /lang="pt-PT"/);
assert.match(html, /name="robots" content="noindex, nofollow, noarchive"/);
assert.match(html, /name="referrer" content="no-referrer"/);
assert.equal((html.match(/<h1\b/g) || []).length, 1);
assert.ok(!/<script|<form|\{\{[A-Z_]+\}\}/.test(html));
assert.match(renderThankYou(), /id="acesso-principal" href="https:\/\/consumer.hotmart.com\/"/);
const ready = renderThankYou({ accessUrl: 'https://area.example.com/entrar?origem=compra&fluxo=acesso', supportUrl: 'mailto:apoio@example.com' });
assert.ok(ready.includes('href="https://area.example.com/entrar?origem=compra&amp;fluxo=acesso"'));
assert.ok(ready.includes('Abrir o meu webapp') && ready.includes('href="mailto:apoio@example.com"'));
for (const accessUrl of ['javascript:alert(1)', 'http://area.example.com', 'https://127.0.0.1/', 'https://user:pass@area.example.com/', 'https://area.example.com/%0a']) assert.throws(() => renderThankYou({ accessUrl }));
assert.throws(() => renderThankYou({ supportUrl: 'mailto:apoio@example.com?bcc=outro@example.com' }));
assert.equal(readFileSync('public/obrigado.html', 'utf8'), html);
assert.deepEqual(readdirSync('public').sort(), ['app', 'assets', 'index.html', 'obrigado-basico.html', 'obrigado-pro.html', 'obrigado.html', 'pro']);
for (const version of ['app', 'pro']) {
  const files = readdirSync('public/' + version, { recursive: true, withFileTypes: true }).filter(entry => entry.isFile());
  const data = JSON.parse(readFileSync('public/' + version + '/index.html', 'utf8').split('<script id="conteudo" type="application/json">')[1].split('</script>')[0]);
  const images = new Set(data.ervas.flatMap(herb => [herb.foto, herb.fotoPequena].filter(Boolean)));
  assert.equal(files.length, 6 + images.size, 'Only compiled HTML, runtime, CSS, fonts/license and used plant images');
  for (const entry of files) {
    const target = path.join(entry.parentPath, entry.name);
    const relative = path.relative('public/' + version, target).replaceAll('\\', '/');
    assert.match(relative, /^(?:index\.html|assets\/(?:app\.js|styles\.css|fonts\/(?:plus-jakarta-sans-(?:400|600)\.ttf|LICENSE-plusjakartasans\.txt)|plantas\/erva-\d+(?:-small)?\.(?:jpg|png|webp)))$/);
    assert.deepEqual(readFileSync(target), readFileSync(path.join('meu-projeto/botica-viva-2026-10-19', version, relative)));
  }
}

const origin = 'http://127.0.0.1:4173';
assert.equal((await fetch(origin + '/obrigado.html')).status, 200);
for (const route of ['/obrigado-basico.html', '/obrigado-pro.html', '/app/', '/pro/']) assert.equal((await fetch(origin + route)).status, 200, route);
for (const route of ['/app', '/pro']) {
  const redirect = await fetch(origin + route, { redirect: 'manual' });
  assert.equal(redirect.status, 308); assert.equal(redirect.headers.get('location'), route + '/');
}
for (const route of ['/app/..%2fsrc/conteudo.mjs', '/pro/..%5cCONTEXTO.md', '/app/src/app.js']) assert.equal((await fetch(origin + route)).status, 404, route);
const cssUrl = '/assets/nova-pagina/css/obrigado.css';
const cssResponse = await fetch(origin + cssUrl);
assert.equal(cssResponse.status, 200);
const css = await cssResponse.text();
for (const match of css.matchAll(/url\('([^']+)'\)/g)) assert.equal((await fetch(new URL(match[1], origin + cssUrl))).status, 200);
for (const url of ['/AGENTS.md', '/.git/config', '/.agents/skills/creator-pagina/SKILL.md', '/meu-projeto/botica-viva-2026-10-19/app/', '/lib/thank-you-config.mjs', '/templates/obrigado.html', '/output/branding/botica-viva-logo.zip']) assert.equal((await fetch(origin + url)).status, 404, url);
console.log('Passed: static rendering, safe config/fallback, noindex, CSP, PT-PT, local HTTP assets and isolated public export.');

if (process.argv.includes('--browser')) {
  const tabs = await (await fetch(`http://127.0.0.1:${process.env.THANK_YOU_CDP_PORT || 9238}/json`)).json();
  const tab = tabs.find(t => t.type === 'page' && (t.url === 'about:blank' || t.url.startsWith(origin)));
  assert.ok(tab, 'Use an isolated Chrome test profile on port 9238.');
  const socket = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let sequence = 0;
  const pending = new Map();
  const errors = [];
  socket.onmessage = event => {
    const message = JSON.parse(String(event.data));
    if (message.id) {
      const waiter = pending.get(message.id); pending.delete(message.id);
      if (message.error) waiter?.reject(Error(JSON.stringify(message.error))); else waiter?.resolve(message.result);
    } else if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
    else if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') errors.push(message.params.args.map(a => a.value || a.description).join(' '));
    else if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) errors.push(message.params.response.url + ': ' + message.params.response.status);
  };
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params }));
    setTimeout(() => { if (pending.delete(id)) reject(Error('Timeout: ' + method)); }, 15000).unref();
  });
  const evaluate = async expression => {
    const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw Error(result.exceptionDetails.text);
    return result.result.value;
  };
  const waitFor = async expression => { for (let i = 0; i < 60; i++) { if (await evaluate(expression)) return; await new Promise(r => setTimeout(r, 50)); } throw Error('Not reached: ' + expression); };
  const press = async key => { await call('Input.dispatchKeyEvent', { type: 'keyDown', key, code: key, text: key === 'Enter' ? '\r' : undefined, windowsVirtualKeyCode: key === 'Tab' ? 9 : 13 }); await call('Input.dispatchKeyEvent', { type: 'keyUp', key, code: key, windowsVirtualKeyCode: key === 'Tab' ? 9 : 13 }); };
  const output = mkdtempSync(path.join(tmpdir(), 'botica-obrigado-qa-'));
  try {
    await call('Runtime.enable'); await call('Page.enable'); await call('Network.enable');
    for (const [width, height] of [[375, 812], [320, 667], [768, 900], [1440, 1000]]) {
      await call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
      await call('Page.navigate', { url: origin + '/obrigado.html' });
      await waitFor('document.readyState === "complete" && !!document.querySelector("#acesso-principal")');
      await evaluate('document.fonts.ready');
      await evaluate('window.scrollTo({top:0,behavior:"instant"})');
      assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), `Overflow at ${width}`);
      assert.ok(await evaluate('document.getElementById("acesso-principal").getBoundingClientRect().bottom <= innerHeight'), `Primary action above fold at ${width}`);
      if (PRO_WEBAPP_ACCESS_URL) assert.ok(await evaluate('document.getElementById("acesso-pro").getBoundingClientRect().bottom <= innerHeight'), `PRO action above fold at ${width}`);
      assert.equal(await evaluate('document.getElementById("acesso-principal").href'), WEBAPP_ACCESS_URL || 'https://consumer.hotmart.com/');
      const photo = await call('Page.captureScreenshot', { format: 'png' });
      writeFileSync(path.join(output, `obrigado-${width}.png`), Buffer.from(photo.data, 'base64'));
      await press('Tab'); assert.equal(await evaluate('document.activeElement.className'), 'skip-link');
      await press('Enter'); await press('Tab'); assert.equal(await evaluate('document.activeElement.id'), 'acesso-principal');
      await evaluate('document.querySelector("summary").focus()'); await press('Enter');
      await waitFor('document.querySelector("details").open');
      assert.ok(await evaluate('document.querySelector("details").open'), 'FAQ keyboard interaction');
      if (width === 375) {
        await evaluate('document.getElementById("apoio").scrollIntoView({behavior:"instant"})');
        const bottom = await call('Page.captureScreenshot', { format: 'png' });
        writeFileSync(path.join(output, 'obrigado-apoio-mobile.png'), Buffer.from(bottom.data, 'base64'));
      }
    }
    await call('Page.navigate', { url: origin + '/obrigado.html?approved=true&plano=pro&access_url=https://outro.example' });
    await waitFor('document.readyState === "complete" && !!document.querySelector("#acesso-principal")');
    assert.equal(await evaluate('document.getElementById("acesso-principal").href'), WEBAPP_ACCESS_URL || 'https://consumer.hotmart.com/', 'Query strings must never select an arbitrary access URL');
    await call('Emulation.setScriptExecutionDisabled', { value: true });
    await call('Page.reload'); await waitFor('document.readyState === "complete" && !!document.querySelector("#acesso-principal")');
    assert.ok(await evaluate('document.getElementById("acesso-principal").getAttribute("href").startsWith("https://")'), 'No-JS access works');
    assert.deepEqual(errors, [], 'No console, CSP or HTTP errors');
    console.log('Passed: Chrome at 320/375/768/1440px, CTA above fold, keyboard, native FAQ, query isolation, no JavaScript dependency, no console/network errors.');
    console.log('Screenshots: ' + output);
  } finally { await call('Emulation.setScriptExecutionDisabled', { value: false }); socket.close(); }
}
