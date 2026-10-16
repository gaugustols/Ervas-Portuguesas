import { readFileSync, writeFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { HookQuestion } from "../components/ui/hook-question";
import { defaults } from "../video/hook-question/hook-question.schema";

const path = new URL("../index.html", import.meta.url);
const html = readFileSync(path, "utf8");
const heading = /(<div class="container hero-heading">)\s*[\s\S]*?(\s*<\/div>)/;
if ((html.match(/class="container hero-heading"/g) ?? []).length !== 1) {
  throw new Error("Expected exactly one hero heading; no files changed.");
}
const markup = renderToStaticMarkup(<HookQuestion {...defaults} />);
let updated = html.replace(heading, (_match, opening: string, closing: string) => `${opening}\n    ${markup}${closing}`);
const stylesheet = '<link rel="stylesheet" href="assets/nova-pagina/css/hook-question.css">';
if (!updated.includes(stylesheet)) updated = updated.replace("</head>", `${stylesheet}\n</head>`);
writeFileSync(path, updated);
console.log("Headline React generated as static HTML; no browser React runtime required.");
