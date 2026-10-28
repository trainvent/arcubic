# Arcubic for Obsidian

An adapter for Arcubic's shared colors, typography and tactile geometry. The website component library remains independent of Obsidian.

Includes light and dark Sage surfaces, Teal/Amber/Orange accents, raised buttons and tabs, recessed inputs, proportional triangle switches, explorer guides, reading typography and code styling. Native Obsidian interactions remain intact. Plugin-specific interfaces may need additional styling.

The build also generates root `manifest.json`, `theme.css` and `versions.json` for Obsidian community-directory compatibility.

## Build and install

Requires Node 24+ and Python 3.

```sh
npm ci
npm run build:obsidian
python3 scripts/install-obsidian.py --vault /absolute/path/to/vault
```

Then select **Arcubic** under **Settings → Appearance → Themes**. Alternatively copy `theme.css`, `manifest.json` and `licenses/` into `<vault>/.obsidian/themes/Arcubic/`.

The installer backs up the existing Arcubic theme and appearance settings under `.obsidian/arcubic-backups/`. It does not activate the theme or modify notes.

Chakra Petch Regular (interface), Lora regular/bold/italic (reading), and Geist Mono (code) are embedded in the public theme. Their OFL copyright notices and licenses are included in the stylesheet and `licenses/`. No personal build or separate font installation is required. Obsidian's font overrides can still replace these defaults.

## Source

- `src/palette.ts`: shared scales and adaptive text colors.
- `src/core/design.ts`: shared font roles and switch proportions.
- `ports/obsidian/src/theme.css`: native Obsidian selectors.
- `ports/obsidian/src/plugins.css`: optional plugin-specific integrations (currently Sports).
- `ports/obsidian/fixtures/Arcubic Preview.md`: visual test note.

Rebuild after changing sources. The compiled stylesheet is a standalone theme and does not require React, a plugin or a running web server.
