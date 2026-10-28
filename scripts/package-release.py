#!/usr/bin/env python3
"""Package explicitly allowlisted public artifacts; never the personal font build."""
import hashlib, json, pathlib, shutil, zipfile
root = pathlib.Path(__file__).resolve().parents[1]
version = json.loads((root / 'package.json').read_text())['version']
tag = f'v{version}'
out = root / 'dist/releases'
out.mkdir(parents=True, exist_ok=True)
source = root / 'ports/obsidian'
css = (source / 'theme.css').read_text()
if 'font/opentype;base64' in css or "font-family:'Nippo';font-weight:200 700" in css:
    raise SystemExit('Refusing to package a private interface font.')
archive = out / f'arcubic-obsidian-{tag}.zip'
files = {
    'Arcubic/theme.css': source / 'theme.css',
    'Arcubic/manifest.json': source / 'manifest.json',
    'Arcubic/README.md': source / 'README.md',
    'Arcubic/LICENSE': root / 'LICENSE',
    'Arcubic/ALPHA.md': root / 'docs/alpha-release.md',
    'Arcubic/THIRD_PARTY_NOTICES.md': root / 'THIRD_PARTY_NOTICES.md',
}
for font_license in sorted((source / 'licenses').glob('*OFL.txt')):
    files[f'Arcubic/licenses/{font_license.name}'] = font_license
with zipfile.ZipFile(archive, 'w', compression=zipfile.ZIP_DEFLATED) as z:
    for name, path in files.items():
        info = zipfile.ZipInfo(name, (2026, 10, 28, 0, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED
        info.external_attr = 0o100644 << 16
        z.writestr(info, path.read_bytes())
for file in [source / 'theme.css', source / 'manifest.json', root / 'packages/core/arcubic-tokens.css', root / 'ports/terminal/arcubic-dark.Xresources']:
    shutil.copy2(file, out / file.name)
assets = sorted(p for p in out.iterdir() if p.is_file() and p.name != 'SHA256SUMS')
(out / 'SHA256SUMS').write_text(''.join(f'{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.name}\n' for p in assets))
print(f'Packaged {archive.name} and {len(assets)-1} companion assets in {out}')
