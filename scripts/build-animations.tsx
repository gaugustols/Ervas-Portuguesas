import { readFileSync, writeFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import ProgressiveBlur from "../components/ProgressiveBlur";

const path = new URL("../index.html", import.meta.url);
let html = readFileSync(path, "utf8");
const block = /<!-- progressive-blur:start -->[\s\S]*?<!-- progressive-blur:end -->/g;
if ((html.match(block) ?? []).length > 1) throw new Error("Expected one blur block; no files changed.");
if (!html.includes("<!-- CTA FIXO")) throw new Error("Fixed CTA marker missing; no files changed.");

await build({
  entryPoints: [fileURLToPath(new URL("./scroll-reveal-client.tsx", import.meta.url))],
  outfile: fileURLToPath(new URL("../assets/nova-pagina/js/scroll-reveal.js", import.meta.url)),
  bundle: true, minify: true, format: "esm", platform: "browser", target: "es2020",
});

// Reserved room lets the final footer text scroll above the fixed 200px effect.
const markup = `<!-- progressive-blur:start -->\n<div aria-hidden="true" data-blur-spacer style="height:200px"></div>\n${renderToStaticMarkup(<ProgressiveBlur />)}\n<!-- progressive-blur:end -->`;
html = html.includes("<!-- progressive-blur:start -->")
  ? html.replace(block, () => markup)
  : html.replace("<!-- CTA FIXO", `${markup}\n\n<!-- CTA FIXO`);
html = html.replace('<div class="cta-fixo">', '<div class="cta-fixo" style="z-index:1000">');
const script = '<script type="module" src="assets/nova-pagina/js/scroll-reveal.js"></script>';
if (!html.includes(script)) html = html.replace("</body>", `${script}\n</body>`);
writeFileSync(path, html);
console.log("Native scroll reveals bundled; eight-layer blur rendered after footer.");
