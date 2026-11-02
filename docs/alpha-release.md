# Arcubic 0.2.0 — Five-color Alpha

Arcubic now has five color families: Teal, Greenish, Amber, Golden orange and Burnt orange, with subtle greenish surfaces in light and dark modes.

## Changes

- Expand the shared palette, web examples, CSS exports, terminal theme, curve icon and title artwork to five families.
- Give Obsidian its own centralized color-role map: Amber titles and selection, Teal links and tags, Orange section headings, Greenish details, and Golden orange emphasis.
- Make links consistent in reading mode, Live Preview, metadata and callouts, including nested bold text and hover states.
- Unify active navigation, menus, tabs and pressed controls through the same primary role.
- Reduce ordinary `!important` overrides and font/CSS duplication. Keep all three font families embedded for offline use, including variable Lora regular/bold/italic.
- Preserve the tactile square controls, sliding triangle switches and native Obsidian behavior.

## Install in Obsidian

1. Download `arcubic-obsidian-0.2.0.zip` from this release.
2. Extract its `Arcubic` folder into `<vault>/.obsidian/themes/`.
3. Select **Arcubic** under **Settings → Appearance → Themes**.

Back up an existing Arcubic folder before replacing it. No plugin, Node installation, separate font download or web server is required. To uninstall, select another theme and remove its theme folder.

Community-theme release assets `theme.css` and `manifest.json` are also attached separately. `arcubic-tokens.css` contains framework-free shared tokens; `arcubic-dark.Xresources` contains the terminal colors. `SHA256SUMS` covers the release assets.

## Validation and limitations

- Palette and color-role contrast tests pass in light and dark modes.
- 728 browser color checks cover reading/editor links, nested callouts, metadata, headings, tags, menus, selected controls, keyboard focus and Sports integration. Tests use actual Obsidian native CSS with plugin styles before and after the theme, in desktop/mobile CSS contexts.
- Tested live on Linux desktop with Obsidian 1.14.5. Mobile devices, Canvas, Bases and all third-party plugin interfaces have not had a complete visual coverage pass.
- Five documented CSS lint warnings remain: three polygon `clip-path` compatibility warnings and two reduced-motion accessibility overrides. Font-embedded CSS can still exceed the reviewer's recommended file size.
- Minimum Obsidian version remains 1.8.0. This is an alpha release; community-directory listing is subject to Obsidian's review process.

Arcubic is MIT licensed. Chakra Petch, Lora and Geist Mono retain their included OFL licenses. Restricted local font experiments are excluded from release assets.

Report issues at https://github.com/Trainvent/arcubic/issues with the appearance mode, Obsidian version and a screenshot without private note content.
