import { cpSync, mkdirSync, readFileSync, copyFileSync, lstatSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'public');
mkdirSync(output, { recursive: true });
cpSync(path.join(root, 'index.html'), path.join(output, 'index.html'));
cpSync(path.join(root, 'obrigado.html'), path.join(output, 'obrigado.html'));
for (const file of ['obrigado-basico.html', 'obrigado-pro.html']) cpSync(path.join(root, file), path.join(output, file));
cpSync(path.join(root, 'upsell-1.html'), path.join(output, 'upsell-1.html'));
cpSync(path.join(root, 'upsell-2.html'), path.join(output, 'upsell-2.html'));
mkdirSync(path.join(output, 'assets'), { recursive: true });
cpSync(path.join(root, 'assets', 'nova-pagina'), path.join(output, 'assets', 'nova-pagina'), { recursive: true });
// Export only the compiled HTML and the assets used by each version; never source/docs.
for (const version of ['app', 'pro']) {
  const source = path.join(root, 'meu-projeto', 'botica-viva-2026-10-19', version);
  const html = readFileSync(path.join(source, 'index.html'), 'utf8');
  const data = JSON.parse(html.match(/<script id="conteudo" type="application\/json">(.*?)<\/script>/s)?.[1] || 'null');
  if (!data?.ervas?.length) throw new Error('Compiled webapp data missing: ' + version);
  const files = new Set(['index.html', 'assets/app.js', 'assets/styles.css',
    'assets/fonts/plus-jakarta-sans-400.ttf', 'assets/fonts/plus-jakarta-sans-600.ttf', 'assets/fonts/LICENSE-plusjakartasans.txt']);
  for (const herb of data.ervas) {
    if (!/^assets\/plantas\/erva-\d+\.(?:jpg|png|webp)$/.test(herb.foto)) throw new Error('Unexpected webapp asset path.');
    files.add(herb.foto);
    if (herb.fotoPequena) {
      if (!/^assets\/plantas\/erva-\d+-small\.webp$/.test(herb.fotoPequena)) throw new Error('Unexpected responsive asset path.');
      files.add(herb.fotoPequena);
    }
  }
  for (const file of files) {
    const from = path.join(source, file);
    if (!lstatSync(from).isFile() || lstatSync(from).isSymbolicLink()) throw new Error('Only regular production files may be exported.');
    const target = path.join(output, version, file);
    mkdirSync(path.dirname(target), { recursive: true });
    copyFileSync(from, target);
  }
}
console.log('Static output generated in public/: landing, thank-you pages, Basic/PRO webapps and production assets only.');
