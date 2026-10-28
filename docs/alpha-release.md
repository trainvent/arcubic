# Arcubic v0.1.0-alpha.1

First public alpha of Arcubic's shared design system and Obsidian adapter.

## Included

- Full Radix Teal, Amber and Orange scales on Sage, in light and dark modes.
- Square panels, raised buttons, recessed fields and a sliding triangle switch.
- Explorer guides, persistent selection, native menus, settings, properties and semantic callouts.
- Lora for reading and Geist Mono for code, embedded in the standalone Obsidian theme.
- A React component preview, framework-free CSS tokens and the Arcubic Dark terminal palette.

## Install in Obsidian

1. Download `arcubic-obsidian-v0.1.0-alpha.1.zip` from this release.
2. Extract its `Arcubic` folder into `<vault>/.obsidian/themes/`.
3. Select **Arcubic** in **Settings → Appearance → Themes**.

No plugin, Node installation or web server is required for the packaged theme. Back up any previous Arcubic folder before replacing it. To uninstall, select another theme and remove the Arcubic folder.

For websites, use `arcubic-tokens.css` with the instructions in `packages/core/README.md`. For terminals, `arcubic-dark.Xresources` supplies the ANSI colors; terminal-specific configuration may be needed.

## Alpha limitations

- Tested on Linux desktop with Obsidian 1.14.5. Mobile, Canvas, Bases and all third-party plugin interfaces have not had a complete coverage pass.
- Sports has a small integration stylesheet; other plugins may retain their own styling.
- Alliance No.2 is a locally supplied licensed interface font and is **not bundled**. The public theme uses it when installed, otherwise the system sans-serif font. Lora and Geist Mono are included under their OFL licenses.
- This is a manual-install prerelease, not an Obsidian community-theme directory submission.
- The GitHub release is marked alpha; Obsidian's numeric manifest version is `0.1.0`.

Report problems at https://github.com/Trainvent/arcubic/issues with the mode, Obsidian version and a screenshot without private note content.

Arcubic's own code is MIT licensed. Bundled fonts retain their separate OFL licenses, included in the archive. Alliance is excluded from the repository and release assets.
