# Arcubic 0.2.2 — Three Colors, Clear Roles

Arcubic returns to Teal, Amber and Burnt orange, with neutral charcoal surfaces and white body text in dark mode.

## Changes

- Make Teal the primary accent for controls, selection and tags.
- Use Blue for links, Green for success and Red for errors, with readable shades in each appearance. These functional colors stay separate from the three-color identity.
- Remove the green tint from backgrounds and ordinary text.
- Restore the three-color web preview, curve artwork and palette controls; add a separate link-blue hint.
- Move the switch triangle diagonally from top-left to bottom-right, with improved corner alignment.
- Preserve native Obsidian font sizes and the bundled Chakra Petch, Lora and Geist Mono fonts.

## Install in Obsidian

1. Download `arcubic-obsidian-0.2.2.zip` from this release.
2. Extract its `Arcubic` folder into `<vault>/.obsidian/themes/`.
3. Select **Arcubic** under **Settings → Appearance → Themes**.

Back up an existing Arcubic folder before replacing it. No plugin, Node installation, separate font download or web server is required. To uninstall, select another theme and remove its theme folder.

Community-theme assets `theme.css` and `manifest.json` are attached separately. `arcubic-tokens.css` contains shared tokens; `arcubic-dark.Xresources` contains terminal colors. `SHA256SUMS` covers the release assets.

## Validation and limitations

- Palette, text-role and native typography guards pass; the web production build succeeds.
- Browser checks cover links, tags, headings, selected controls and integration styling across light/dark and desktop/mobile contexts.
- Switch geometry was checked in native desktop, mobile, dialog and list contexts, and adjusted in the debugging vault.
- Tested live on Linux desktop with Obsidian 1.14.5. Physical mobile devices, Canvas, Bases and every third-party plugin have not had complete visual coverage.
- Three polygon `clip-path` compatibility warnings and two reduced-motion accessibility overrides remain. Embedded fonts can exceed the reviewer's recommended CSS size.
- Minimum Obsidian version remains 1.8.0. This is an alpha release.

Arcubic is MIT licensed. Bundled fonts retain their included OFL licenses.

Report issues at https://github.com/Trainvent/arcubic/issues with the appearance mode, Obsidian version and a screenshot without private note content.
