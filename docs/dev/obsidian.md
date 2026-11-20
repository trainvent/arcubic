# Trying Obsidian changes

`npm run dev:obsidian -- /path/to/vault` builds the theme and links it into that vault as **Arcubic Dev**, next to the released Arcubic. Select it under *Settings → Appearance → Themes*. Use a test vault: vaults you work in should keep the released theme.

The vault's `theme.css` is a link to `ports/obsidian/theme.css`, so after that, `npm run build:obsidian` is enough. Obsidian picks up the new CSS when you switch away from the theme and back, or reload the app.

Tab strip sizes come from `documentTabs` in `src/core/design.ts`, shared with VS Code, and reach the Obsidian CSS as `--arc-tab-strip-height`, `--arc-tab-height` and `--arc-tab-inset`.
