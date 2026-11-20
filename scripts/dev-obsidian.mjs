import {mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';

// Links the repository build into a vault as "Arcubic Dev", next to the released theme,
// so every npm run build:obsidian reaches the vault.
const vault = process.argv[2];
if (!vault) throw new Error('Pass the vault folder: npm run dev:obsidian -- /path/to/vault');
const root = new URL('../', import.meta.url);
const NAME = 'Arcubic Dev';
const manifest = JSON.parse(readFileSync(new URL('ports/obsidian/manifest.json', root), 'utf8'));
const target = join(vault, '.obsidian', 'themes', NAME);
mkdirSync(target, {recursive: true});
writeFileSync(join(target, 'manifest.json'), JSON.stringify({...manifest, name: NAME}, null, 2) + '\n');
rmSync(join(target, 'theme.css'), {force: true});
symlinkSync(fileURLToPath(new URL('ports/obsidian/theme.css', root)), join(target, 'theme.css'));
console.log(`Linked ${NAME} in ${target}`);
