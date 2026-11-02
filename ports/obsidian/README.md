# Arcubic for Obsidian

An adapter for Arcubic's shared colors, typography and tactile geometry. The website component library remains independent of Obsidian.

Includes neutral grayscale surfaces in light and dark modes, three curve accents, raised buttons and tabs, recessed inputs, proportional triangle switches, explorer guides, reading typography and code styling. Native Obsidian interactions remain intact. Plugin-specific interfaces may need additional styling.

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

Chakra Petch Regular (interface), Lora variable regular/bold/italic (reading), and Geist Mono (code) are embedded in the public theme. Their OFL copyright notices and licenses are included in the stylesheet and `licenses/`. No personal build or separate font installation is required. Obsidian's font overrides can still replace these defaults. Font sizes come from Obsidian, including its reading-size setting and mobile scale; compact web-preview sizes are not applied to this adapter.

## Source

- `src/palette.ts`: shared scales and adaptive text colors.
- `src/core/design.ts`: shared font roles and switch proportions.
- `ports/obsidian/colors.ts`: central Obsidian-only color assignments.
- `ports/obsidian/src/colors.css`: native color-role mapping.
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

## Obsidian color roles

The adapter follows [Tokyo Night's color relationships](https://github.com/tcmmichaelb139/obsidian-tokyonight/blob/main/theme.css)
with Arcubic's three hues. Surfaces use neutral grays, with charcoal backgrounds and white body text in dark mode.

| Adapter variable | Native roles |
| --- | --- |
| `--arc-obs-primary` | Teal: H1/inline title, active files/folders/tabs, selected menus/settings/buttons, active icons, tags |
| `--arc-obs-section` | Burnt orange: H2 and question callouts |
| `--arc-obs-detail` | Amber: H3 and checked checkboxes |
| `--arc-obs-emphasis` | Burnt orange: H4, bold/italic emphasis and summary callouts |
| `--arc-obs-link` | Blue: internal/external/unresolved links, H6 and example callouts |

H5 reuses the primary Teal because the reference's six heading hues map onto three Arcubic families and link blue.
Warning, error and success callouts retain their semantic distinctions. Links use
one normal and hover role in the same Blue family everywhere, including nested callouts, metadata and Live Preview.
The Sports integration uses the same native heading, emphasis, link and selection roles.

`obsidianAccentFamilies` in `ports/obsidian/colors.ts` assigns five semantic roles
to palette families. This one map drives both readable foregrounds and solid/surface
tones, so changing a primary family also updates buttons, borders and selection.
`ports/obsidian/src/colors.css` is the single native-variable role map. Component
styles in `theme.css` and `plugins.css` consume that namespace; they cannot reference
shared web text roles or select raw accent families. Shared palette changes still
supply color values, while web role reassignments cannot alter Obsidian assignments.

## Color regression checks

```sh
npm run test:obsidian
npm run build:obsidian
npm run test:obsidian:browser -- --native-css /path/to/Obsidian/app.css --plugin-css /path/to/plugin/styles.css
```

The browser test uses an installed Chrome (`--browser /path/to/chrome` overrides the
Linux default). It checks native reading/editor/metadata links, nested callouts,
headings, emphasis, tags, menus, settings, selected buttons, tabs and dashboard
labels in light/dark and desktop/mobile CSS contexts. Plugin CSS is tested before
and after the theme. The native stylesheet is required to exercise real host specificity.
`--plugin-css` is optional. Playwright Core is a development-only driver; no browser
or npm package is shipped in the theme.

## Native typography sizing

Arcubic supplies font families and colors while Obsidian supplies sizes for reading,
headings, code, navigation, tabs, controls, labels and metadata. The adapter does
not export the compact web `--arc-type-*` or `--arc-leading-*` tokens. Existing
local line-height/padding fixes for clipped labels remain in place.

```sh
npm run test:obsidian:typography -- --native-css /path/to/Obsidian/app.css
```

This compares computed font sizes with native Obsidian in light/dark and
desktop/mobile CSS contexts, at 16px and 22px reading settings.
