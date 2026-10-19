import { readFileSync, writeFileSync } from "node:fs";
import { renderToString } from "react-dom/server";
import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import FrequentlyAskedQuestions from "../components/ui/frequently-asked-questions-with-accordion";
import { faqConfig } from "../lib/faq-config";

const path = new URL("../index.html", import.meta.url);
let html = readFileSync(path, "utf8");
const block = /<!-- faq:start -->[\s\S]*?<!-- faq:end -->/g;
if ((html.match(block) ?? []).length > 1) throw new Error("Expected at most one FAQ; no files changed.");
if (!html.includes("<!-- faq:start -->") && (html.match(/<!-- FOOTER -->/g) ?? []).length !== 1) {
  throw new Error("Expected exactly one footer after the guarantee; no files changed.");
}

await build({
  entryPoints: [fileURLToPath(new URL("./faq-client.tsx", import.meta.url))],
  outfile: fileURLToPath(new URL("../assets/nova-pagina/js/faq.js", import.meta.url)),
  bundle: true,
  minify: true,
  format: "esm",
  platform: "browser",
  target: "es2020",
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  legalComments: "eof",
});

const content = renderToString(<FrequentlyAskedQuestions {...faqConfig} />, { identifierPrefix: "faq-" });
const markup = `<!-- faq:start -->\n<div id="faq-root">${content}</div>\n<!-- faq:end -->`;
html = html.includes("<!-- faq:start -->")
  ? html.replace(block, () => markup)
  : html.replace("<!-- FOOTER -->", `${markup}\n\n<!-- FOOTER -->`);
const script = '<script type="module" src="assets/nova-pagina/js/faq.js"></script>';
if (!html.includes(script)) html = html.replace("</body>", `${script}\n</body>`);
writeFileSync(path, html);
console.log("FAQ rendered below the guarantee and React accordion bundled.");
