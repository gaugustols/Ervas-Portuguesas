import { readFileSync, writeFileSync } from "node:fs";
import { renderToString } from "react-dom/server";
import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import { VslPlayer } from "../components/ui/vsl-player";
import { VIDEO_URL } from "../lib/video-config";

const path = new URL("../index.html", import.meta.url);
let html = readFileSync(path, "utf8");
const block = /<!-- hero-vsl:start -->[\s\S]*?<!-- hero-vsl:end -->|<div class="hero-video" data-hero-video[\s\S]*?<\/button>\s*<\/div>/g;
if ((html.match(block) ?? []).length !== 1) throw new Error("Expected exactly one hero video; no files changed.");

await build({
  entryPoints: [fileURLToPath(new URL("./vsl-client.tsx", import.meta.url))],
  outfile: fileURLToPath(new URL("../assets/nova-pagina/js/vsl-player.js", import.meta.url)),
  bundle: true,
  minify: true,
  format: "esm",
  platform: "browser",
  target: "es2020",
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  legalComments: "eof",
});

const content = renderToString(<VslPlayer videoUrl={VIDEO_URL} />);
html = html.replace(block, `<!-- hero-vsl:start -->\n  <div id="hero-vsl-root" class="hero-video" data-hero-video role="group" aria-label="Vídeo de apresentação da Botica Viva">${content}</div>\n  <!-- hero-vsl:end -->`);
const script = '<script type="module" src="assets/nova-pagina/js/vsl-player.js"></script>';
if (!html.includes(script)) html = html.replace("</body>", `${script}\n</body>`);
writeFileSync(path, html);
console.log("VSL thumbnail rendered and React client component bundled.");
