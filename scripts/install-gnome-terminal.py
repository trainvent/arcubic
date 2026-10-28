#!/usr/bin/env python3
"""Install Arcubic as a separate GNOME Terminal profile; retain the prior profile."""
import ast
import datetime
import pathlib
import subprocess
import uuid

ROOT = '/org/gnome/terminal/legacy/'

def run(*args, input=None):
    return subprocess.run(args, input=input, text=True, check=True, capture_output=True).stdout.strip()

def read(key):
    return run('dconf', 'read', ROOT + key)

def write(key, value):
    run('dconf', 'write', ROOT + key, value)

source = pathlib.Path(__file__).resolve().parent.parent / 'ports/terminal/arcubic-dark.Xresources'
colors = {}
for line in source.read_text().splitlines():
    if line.startswith('*.'):
        key, value = line[2:].split(':', 1)
        colors[key] = value.strip()
# GNOME's stock profile can exist only as a schema default, without a dconf value.
stock_profile = 'b1dcc9dd-5262-4d8d-a863-c897e6d979b9'
profiles = ast.literal_eval(read('profiles:/list') or repr([stock_profile]))
if stock_profile not in profiles:
    profiles.insert(0, stock_profile)
previous = ast.literal_eval(read('profiles:/default') or repr(stock_profile))
backup_dir = pathlib.Path.home() / '.config/arcubic'
backup_dir.mkdir(parents=True, exist_ok=True)
backup = backup_dir / ('gnome-terminal-before-' + datetime.datetime.now().strftime('%Y%m%d-%H%M%S') + '.dconf')
backup.write_text(run('dconf', 'dump', ROOT) + '\n')
profile = None
for candidate in profiles:
    if read(f'profiles:/:{candidate}/visible-name') == "'Arcubic Dark'":
        profile = candidate
        break
if profile is None:
    profile = str(uuid.uuid4())
    if previous:
        old = run('dconf', 'dump', ROOT + f'profiles:/:{previous}/')
        if old:
            run('dconf', 'load', ROOT + f'profiles:/:{profile}/', input=old + '\n')
    profiles.append(profile)
base = f'profiles:/:{profile}/'
for key, value in {
    'visible-name': "'Arcubic Dark'",
    'use-theme-colors': 'false',
    'background-color': repr(colors['background']),
    'foreground-color': repr(colors['foreground']),
    'palette': repr([colors[f'color{i}'] for i in range(16)]),
    'cursor-colors-set': 'true',
    'cursor-background-color': repr(colors['cursorColor']),
    'cursor-foreground-color': repr(colors['background']),
    'highlight-colors-set': 'true',
    'highlight-background-color': repr(colors['selectionBackground']),
    'highlight-foreground-color': repr(colors['selectionForeground']),
    'use-transparent-background': 'false',
}.items():
    write(base + key, value)
write('profiles:/list', repr(profiles))
write('profiles:/default', repr(profile))
assert ast.literal_eval(read('profiles:/default')) == profile
assert ast.literal_eval(read(base + 'palette')) == [colors[f'color{i}'] for i in range(16)]
assert ast.literal_eval(read(base + 'background-color')) == colors['background']
print('Installed and verified Arcubic Dark as the default GNOME Terminal profile.')
print('Previous profile retained:', previous)
print('Backup:', backup)
