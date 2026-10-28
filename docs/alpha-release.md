# Arcubic 0.1.1 — Alpha

Updated alpha of Arcubic's shared design system and Obsidian adapter.

## Changes in 0.1.1

- Active document tabs join the page and have more vertical breathing room.
- Inactive tabs blend into the tab strip without raised borders or hover boxes.
- Close buttons appear on inactive-tab hover; only the × turns red when hovered.
- Search focus uses one thin teal border instead of stacked focus rings.
- The README documents Arcubic's technical style, purposeful depth, triangular interactions and state guidelines.
- Build metadata now follows the package version and preserves Obsidian compatibility history.

## Included

- Full Radix Teal, Amber and Orange scales on Sage, in light and dark modes.
- Square panels, raised buttons, recessed fields and a sliding triangle switch.
- Explorer guides, persistent selection, native menus, settings, properties and semantic callouts.
- Chakra Petch Regular for the interface, Lora for reading and Geist Mono for code; all three are embedded with OFL licenses.
- A React component preview, framework-free CSS tokens and the Arcubic Dark terminal palette.

## Install in Obsidian

1. Download `arcubic-obsidian-0.1.1.zip` from this release.
2. Extract its `Arcubic` folder into `<vault>/.obsidian/themes/`.
3. Select **Arcubic** in **Settings → Appearance → Themes**.

No plugin, Node installation or web server is required for the packaged theme. Back up any previous Arcubic folder before replacing it. To uninstall, select another theme and remove the Arcubic folder.

For websites, use `arcubic-tokens.css` with the instructions in `packages/core/README.md`. For terminals, `arcubic-dark.Xresources` supplies the ANSI colors; terminal-specific configuration may be needed.

## Alpha limitations

- Tested on Linux desktop with Obsidian 1.14.5. Mobile, Canvas, Bases and all third-party plugin interfaces have not had a complete coverage pass.
- Sports has a small integration stylesheet; other plugins may retain their own styling.
- The build bundles Chakra Petch, Lora and Geist Mono under the OFL. No separate font download is required.
- Manual installation is available now. Community-directory listing is subject to Obsidian’s submission and review process.
- This is an alpha build. Its release tag and Obsidian manifest both use `0.1.1`, as required by the community directory.

Report problems at https://github.com/Trainvent/arcubic/issues with the mode, Obsidian version and a screenshot without private note content.

Arcubic's own code is MIT licensed. Bundled fonts retain their separate OFL licenses, included in the archive. Restricted font experiments are excluded from the repository and release assets.
