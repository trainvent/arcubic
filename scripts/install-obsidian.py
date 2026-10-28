#!/usr/bin/env python3
"""Install the built Arcubic adapter into one explicitly selected vault."""
import argparse, datetime, pathlib, shutil
parser = argparse.ArgumentParser()
parser.add_argument('--vault', required=True, type=pathlib.Path)
args = parser.parse_args()
root = pathlib.Path(__file__).resolve().parents[1]
vault = args.vault.expanduser().resolve()
if not (vault / '.obsidian').is_dir():
    parser.error('The selected folder must contain an existing .obsidian directory.')
source = root / 'ports/obsidian'
if not (source / 'theme.css').is_file():
    parser.error('Build the theme before installing it.')
stamp = datetime.datetime.now().strftime('%Y%m%d-%H%M%S-%f')
backup = vault / '.obsidian/arcubic-backups' / stamp
backup.mkdir(parents=True)
appearance = vault / '.obsidian/appearance.json'
if appearance.exists():
    shutil.copy2(appearance, backup / 'appearance.json')
target = vault / '.obsidian/themes/Arcubic'
if target.exists():
    shutil.copytree(target, backup / 'Arcubic')
target.mkdir(parents=True, exist_ok=True)
for filename in ['theme.css', 'manifest.json']:
    shutil.copy2(source / filename, target / filename)
shutil.copytree(root / 'ports/obsidian/licenses', target / 'licenses', dirs_exist_ok=True)
print(f'Installed: {target}\nBackup: {backup}\nActivate Arcubic in Appearance → Themes.')
