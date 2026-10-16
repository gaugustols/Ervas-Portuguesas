import { readFileSync, writeFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { RatingSummary } from "../components/ui/rating-summary";
import { defaults } from "../video/rating-summary/rating-summary.schema";

const path = new URL("../index.html", import.meta.url);
let html = readFileSync(path, "utf8");
const section = /(<section class="sec depoimentos">)([\s\S]*?)(<\/section>)/;
if ((html.match(/<section class="sec depoimentos">/g) ?? []).length !== 1) throw new Error("Expected one testimonials section.");
const markup = `<!-- rating-summary:start -->\n    ${renderToStaticMarkup(<RatingSummary {...defaults} />)}\n    <!-- rating-summary:end -->`;
html = html.replace(section, (_match, opening: string, body: string, closing: string) => {
  const target = body.includes("<!-- rating-summary:start -->")
    ? /<!-- rating-summary:start -->[\s\S]*?<!-- rating-summary:end -->/
    : /<div class="dep-grid">[\s\S]*?<\/div>/;
  if (!target.test(body)) throw new Error("Testimonials target missing; no files changed.");
  const updated = body.replace(target, () => markup).replace(/(<p class="dep-sub">)[\s\S]*?(<\/p>)/, "$1Excertos de comentários públicos sobre a obra de origem.$2");
  return opening + updated + closing;
});
const css = '<link rel="stylesheet" href="assets/nova-pagina/css/rating-summary.css">';
const script = '<script src="assets/nova-pagina/js/rating-summary.js" defer></script>';
if (!html.includes(css)) html = html.replace("</head>", `${css}\n</head>`);
if (!html.includes(script)) html = html.replace("</body>", `${script}\n</body>`);
writeFileSync(path, html);
console.log("Testimonial photos replaced with static rating summary and existing review excerpts.");
