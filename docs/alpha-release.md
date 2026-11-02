# Arcubic 0.2.1 — Native Typography

This patch restores native Obsidian typography sizing while retaining Arcubic's fonts, five-color palette and subtle greenish surfaces.

## Changes

- Stop applying the web demo's compact font sizes to Obsidian.
- Restore native sizes for reading text, headings, code, navigation, tabs, controls, metadata, status text and labels.
- Respect Obsidian's reading-size setting and native mobile sizing instead of exporting web typography metrics into the adapter.
- Keep Chakra Petch, Lora and Geist Mono, the Amber-primary/Teal-link color mapping, and existing label-clipping fixes.

## Install in Obsidian

1. Download `arcubic-obsidian-0.2.1.zip` from this release.
2. Extract its `Arcubic` folder into `<vault>/.obsidian/themes/`.
3. Select **Arcubic** under **Settings → Appearance → Themes**.

Back up an existing Arcubic folder before replacing it. No plugin, Node installation, separate font download or web server is required. To uninstall, select another theme and remove its theme folder.

Community-theme release assets `theme.css` and `manifest.json` are also attached separately. `arcubic-tokens.css` contains framework-free shared tokens; `arcubic-dark.Xresources` contains the terminal colors. `SHA256SUMS` covers the release assets.

## Validation and limitations

- Palette, color-role and typography-guard tests pass.
- 128 computed font-size comparisons match native Obsidian at 16px and 22px reading settings across light/dark and desktop/mobile CSS contexts. A live-vault check confirmed the reading setting changes font size and was restored afterward.
- 728 browser color checks cover reading/editor links, nested callouts, metadata, headings, tags, menus, selected controls, keyboard focus and Sports integration. Tests use actual Obsidian native CSS with plugin styles before and after the theme, in desktop/mobile CSS contexts.
- Tested live on Linux desktop with Obsidian 1.14.5. Mobile devices, Canvas, Bases and all third-party plugin interfaces have not had a complete visual coverage pass.
- Five documented CSS lint warnings remain: three polygon `clip-path` compatibility warnings and two reduced-motion accessibility overrides. Font-embedded CSS can still exceed the reviewer's recommended file size.
- Minimum Obsidian version remains 1.8.0. This is an alpha release; community-directory listing is subject to Obsidian's review process.

Arcubic is MIT licensed. Chakra Petch, Lora and Geist Mono retain their included OFL licenses. Restricted local font experiments are excluded from release assets.

Report issues at https://github.com/Trainvent/arcubic/issues with the appearance mode, Obsidian version and a screenshot without private note content.
