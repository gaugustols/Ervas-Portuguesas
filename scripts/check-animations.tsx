import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { renderToStaticMarkup } from "react-dom/server";
import { build } from "esbuild";
import ScrollReveal from "../components/ScrollReveal";
import ProgressiveBlur from "../components/ProgressiveBlur";

const html = readFileSync("index.html", "utf8");
const blur = renderToStaticMarkup(<ProgressiveBlur />);
assert.ok(html.includes(blur));
assert.equal((blur.match(/backdrop-filter:blur\(/g) ?? []).length, 16);
assert.equal((blur.match(/-webkit-mask-image:/g) ?? []).length, 8);
assert.ok(blur.includes("z-index:999;pointer-events:none"));
assert.ok(html.indexOf("data-progressive-blur") > html.indexOf("</footer>"));
assert.ok(!readFileSync("components/ProgressiveBlur.tsx", "utf8").includes('"use client"'));
assert.ok(readFileSync("assets/nova-pagina/js/scroll-reveal.js").length < 12000, "Native runtime stays small");
const reusable = renderToStaticMarkup(<ScrollReveal className="hq:col-span-2"><article className="hq:h-full">Readable SSR</article></ScrollReveal>);
assert.ok(reusable.includes('class="hq:col-span-2"') && reusable.includes('class="hq:h-full"'));
assert.ok(!reusable.includes("opacity:0"), "SSR remains readable without JS");
const normalize = (s: string) => s.replaceAll("\r\n", "\n");
const baseline = normalize(execFileSync("git", ["show", "HEAD:index.html"], { encoding: "utf8" }));
const stripped = normalize(html)
  .replace(/<!-- progressive-blur:start -->[\s\S]*?<!-- progressive-blur:end -->\n\n/, "")
  .replace('\n<script type="module" src="assets/nova-pagina/js/scroll-reveal.js"></script>', "")
  .replace('<div class="cta-fixo" style="z-index:1000">', '<div class="cta-fixo">');
// Before committing this feature, only the overlay, spacer, CTA stacking and module may differ.
if (!baseline.includes("data-progressive-blur")) assert.equal(stripped, baseline);

const fixture = await build({
  stdin: { contents: `
    import {createRoot} from 'react-dom/client';
    import ScrollReveal from './components/ScrollReveal';
    let host,root;
    globalThis.__revealFixture={
      mount(options){host=document.createElement('div');host.style.cssText='position:fixed;left:40px;top:2000px;width:200px;z-index:2000';document.body.append(host);root=createRoot(host);root.render(<ScrollReveal {...options} className="fixture-reveal" style={{height:80}}>Reveal fixture</ScrollReveal>)},
      move(top){host.style.top=top+'px'},
      remove(){root.unmount();host.remove()}
    };
  `, resolveDir: process.cwd(), loader: "tsx" },
  bundle: true, write: false, minify: true, platform: "browser", format: "iife", jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
});

const url = "http://127.0.0.1:4173/";
const tabs = await (await fetch(`http://127.0.0.1:${process.env.ANIMATIONS_CDP_PORT || 9236}/json`)).json() as {type: string; url: string; webSocketDebuggerUrl: string}[];
const tab = tabs.find(t => t.type === "page" && (t.url === "about:blank" || t.url.startsWith(url)));
assert.ok(tab, "Open an isolated Chrome profile for the check");
const socket = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise<void>((resolve, reject) => { socket.onopen = () => resolve(); socket.onerror = reject; });
let id = 0;
const pending = new Map<number, [(x: any) => void, (e: Error) => void]>();
const errors: string[] = [];
socket.onmessage = event => {
  const m = JSON.parse(String(event.data));
  if (m.id) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p?.[1](Error(JSON.stringify(m.error))) : p?.[0](m.result); }
  else if (m.method === "Runtime.exceptionThrown") errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
  else if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") errors.push(m.params.args.map((a: any) => a.value || a.description).join(" "));
};
function call(method: string, params = {}): Promise<any> {
  return new Promise((resolve, reject) => { const n = ++id; pending.set(n, [resolve, reject]); socket.send(JSON.stringify({ id: n, method, params })); setTimeout(() => { if (pending.delete(n)) reject(Error(`Timeout: ${method}`)); }, 15000).unref(); });
}
async function evaluate(expression: string) {
  const result = await call("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result?.value;
}
const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const output = mkdtempSync(path.join(tmpdir(), "botica-animations-"));
async function viewport(width: number, height = 900) { await call("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false }); }
async function scrollTo(top: number) { await evaluate(`window.scrollTo({top:${top},behavior:'instant'})`); await pause(140); }
async function screenshot(name: string) { const data = await call("Page.captureScreenshot", { format: "png" }); writeFileSync(path.join(output, name + ".png"), Buffer.from(data.data, "base64")); }
async function waitFor(expression: string) { for (let n = 0; n < 60; n++) { if (await evaluate(expression)) return; await pause(50); } throw Error("Not reached: " + expression); }

try {
  await call("Runtime.enable"); await call("Page.enable");
  await call("Emulation.setEmulatedMedia", { features: [{name: "prefers-reduced-motion", value: "no-preference"}] });
  await viewport(1440);
  await call("Page.navigate", { url }); await waitFor('document.querySelectorAll("[data-scroll-reveal]").length>30');
  await evaluate("document.fonts.ready"); await pause(1500);
  assert.equal(await evaluate('document.querySelectorAll("[data-progressive-blur] > div").length'), 8);
  assert.ok(await evaluate('document.querySelectorAll("[data-reveal-state=pending]").length>0'), "Offscreen content is prepared");
  assert.equal(await evaluate('document.querySelector(".hero-video").dataset.scrollReveal'), "right");
  assert.equal(await evaluate('document.querySelector(".hero h1").dataset.scrollReveal'), "left");
  assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth'));
  await screenshot("hero-desktop");

  // Scroll through the page, not past it, to exercise real intersection callbacks.
  const height = await evaluate("document.documentElement.scrollHeight");
  for (let top = 0; top < height; top += 580) await scrollTo(top);
  await pause(1500);
  assert.equal(await evaluate('document.querySelectorAll("[data-reveal-state=pending]").length'), 0, "All landing targets reveal");
  assert.ok(await evaluate('[...document.querySelectorAll("[data-scroll-reveal]")].every(e=>e.style.willChange==="")'), "GPU hints released");
  const states = await evaluate('JSON.stringify([...document.querySelectorAll("[data-scroll-reveal]")].map(e=>e.dataset.revealState))');
  await scrollTo(0); await pause(200);
  assert.equal(await evaluate('JSON.stringify([...document.querySelectorAll("[data-scroll-reveal]")].map(e=>e.dataset.revealState))'), states, "Once does not replay");
  await viewport(375, 812); await pause(150);
  assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth'));
  assert.equal(await evaluate('getComputedStyle(document.querySelector("[data-progressive-blur]")).pointerEvents'), "none");
  assert.equal(await evaluate('document.querySelector(".cta-fixo")'), null, "Fixed purchase bar is removed");
  await screenshot("hero-mobile");
  await scrollTo(await evaluate('document.getElementById("oferta").getBoundingClientRect().top+scrollY'));
  await screenshot("pricing-mobile");
  await scrollTo(await evaluate("document.documentElement.scrollHeight"));
  assert.ok(await evaluate('document.querySelector("footer").getBoundingClientRect().bottom<=innerHeight-200+1'), "Footer can clear the blur");
  await screenshot("footer-mobile");

  // The same reusable React component is exercised in a temporary fixture.
  await evaluate(fixture.outputFiles[0].text);
  await evaluate('__revealFixture.mount({direction:"left",delay:100,duration:120,distance:"20px",once:false,threshold:0.75})');
  await waitFor('document.querySelector(".fixture-reveal")?.dataset.revealState==="pending"');
  assert.equal(await evaluate('document.querySelector(".fixture-reveal").style.opacity'), "0");
  assert.equal(await evaluate('new DOMMatrix(getComputedStyle(document.querySelector(".fixture-reveal")).transform).m41'), -20);
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".fixture-reveal")).transitionDelay'), "0.1s, 0.1s");
  await evaluate("__revealFixture.move(780)"); await pause(250);
  assert.equal(await evaluate('document.querySelector(".fixture-reveal").dataset.revealState'), "pending", "Threshold honored");
  await evaluate("__revealFixture.move(100)"); await waitFor('document.querySelector(".fixture-reveal").dataset.revealState==="complete"');
  await evaluate("__revealFixture.move(1600)"); await waitFor('document.querySelector(".fixture-reveal").dataset.revealState==="pending"');
  await evaluate("__revealFixture.move(100)"); await waitFor('document.querySelector(".fixture-reveal").dataset.revealState==="complete"');
  await evaluate("__revealFixture.remove()");
  for (const direction of ["up", "down", "right", "none"]) {
    await evaluate(`__revealFixture.mount({direction:${JSON.stringify(direction)},duration:0})`);
    await waitFor('document.querySelector(".fixture-reveal")?.dataset.revealState==="pending"');
    await evaluate("__revealFixture.move(100)"); await waitFor('document.querySelector(".fixture-reveal").dataset.revealState==="complete"');
    await evaluate("__revealFixture.move(1600)"); await pause(120);
    assert.equal(await evaluate('document.querySelector(".fixture-reveal").dataset.revealState'), "complete");
    await evaluate("__revealFixture.remove()");
  }
  await call("Emulation.setEmulatedMedia", { features: [{name: "prefers-reduced-motion", value: "reduce"}] });
  await evaluate('__revealFixture.mount({direction:"up"})'); await waitFor('document.querySelector(".fixture-reveal")?.dataset.revealState==="complete"');
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".fixture-reveal")).opacity'), "1");
  await evaluate("__revealFixture.remove()");
  await call("Page.reload"); await waitFor('document.querySelectorAll("[data-scroll-reveal]").length>30');
  assert.equal(await evaluate('document.querySelectorAll("[data-reveal-state=pending]").length'), 0, "Reduced motion at page load");
  assert.deepEqual(errors, [], "No JS or hydration errors");
  console.log("Passed: SSR, eight inline blur layers, scroll, once/repeat, directions, delay, threshold, motion preference, layout and absence of the fixed purchase bar.");
  console.log("Screenshots: " + output);
} finally { socket.close(); }
