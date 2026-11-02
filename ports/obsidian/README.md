# Arcubic for Obsidian

An adapter for Arcubic's shared colors, typography and tactile geometry. The website component library remains independent of Obsidian.

Includes light and dark Sage surfaces, Teal/Amber/Orange accents, raised buttons and tabs, recessed inputs, proportional triangle switches, explorer guides, reading typography and code styling. Native Obsidian interactions remain intact. Plugin-specific interfaces may need additional styling.

The build also generates root `manifest.json`, `theme.css` and `versions.json` for Obsidian community-directory compatibility.

## Build and install

Requires Node 24+ and Python 3.

```sh
npm ci
npm run build:obsidian
npm run lint:obsidian
python3 scripts/install-obsidian.py --vault /absolute/path/to/vault
```

Then select **Arcubic** under **Settings → Appearance → Themes**. Alternatively copy `theme.css`, `manifest.json` and `licenses/` into `<vault>/.obsidian/themes/Arcubic/`.

The installer backs up the existing Arcubic theme and appearance settings under `.obsidian/arcubic-backups/`. It does not activate the theme or modify notes.

Chakra Petch Regular (interface), Lora variable regular/bold/italic (reading), and Geist Mono (code) are embedded in the public theme. Their OFL copyright notices and licenses are included in the stylesheet and `licenses/`. No personal build or separate font installation is required. Obsidian's font overrides can still replace these defaults.

## Source

- `src/palette.ts`: shared scales and adaptive text colors.
- `src/core/design.ts`: shared font roles and switch proportions.
- `ports/obsidian/src/theme.css`: native Obsidian selectors.
- `ports/obsidian/src/plugins.css`: optional plugin-specific integrations (currently Sports).
- `ports/obsidian/fixtures/Arcubic Preview.md`: visual test note.

Rebuild after changing sources. The compiled stylesheet is a standalone theme and does not require React, a plugin or a running web server.

## Review warnings

The two remaining `!important` declarations implement reduced motion across native
and plugin selectors. They intentionally take precedence over decorative animation.

The three `clip-path` declarations use polygon shapes. The browser compatibility
database marks Chromium as partially supported because external SVG clip paths are
unsupported; this theme does not use that syntax. See the
[upstream compatibility notes](https://github.com/Fyrd/caniuse/blob/main/features-json/css-clip-path.json).
Keep the polygon geometry unless testing reveals a rendering issue.

Fonts remain embedded for offline use. Lora's Latin variable faces cover normal
and italic weights 400–700 from the same release as the website's static fonts.
All font copyright notices and the shared OFL license are embedded in the CSS;
individual license files are also copied into the theme directory. The CSS size
warning still requires confirmation from the original release checker.

The Obsidian build emits only palette tokens referenced by its adapter and their
transitive dependencies. The shared core palette remains complete. `npm run
lint:obsidian` runs Obsidian's official review-specific rules against the generated
stylesheet, without the inherited stylistic rules. Its conservative Electron 31
target reproduces the reported Obsidian 1.7.4 compatibility baseline. It does not
replace the community directory's separate release checks.

Distribution CSS is compacted with esbuild's whitespace-only minifier. Source CSS
remains readable; all font notices, the full shared OFL license, and the Radix
license remain embedded in the distribution. No npm runtime is installed in a vault.
