import { copyFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

for (const directory of ['media/fonts', 'media/entrada', 'media/referencias', 'projects/local', '../output/videos']) {
  mkdirSync(fileURLToPath(new URL('../' + directory + '/', import.meta.url)), { recursive: true });
}
for (const file of ['plus-jakarta-sans-400.ttf', 'plus-jakarta-sans-600.ttf', 'LICENSE-plusjakartasans.txt']) {
  copyFileSync(new URL('../../assets/nova-pagina/fonts/' + file, import.meta.url), new URL('../media/fonts/' + file, import.meta.url));
}
console.log('Pastas locais e fontes da Botica Viva preparadas.');
