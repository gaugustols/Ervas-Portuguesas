import { cpSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'public');
mkdirSync(output, { recursive: true });
cpSync(path.join(root, 'index.html'), path.join(output, 'index.html'));
cpSync(path.join(root, 'obrigado.html'), path.join(output, 'obrigado.html'));
mkdirSync(path.join(output, 'assets'), { recursive: true });
cpSync(path.join(root, 'assets', 'nova-pagina'), path.join(output, 'assets', 'nova-pagina'), { recursive: true });
console.log('Static output generated in public/: index.html and production assets only.');
