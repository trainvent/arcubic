# Arcubic 0.3.0 — React and Next.js

Arcubic now ships as an independently installable React package alongside the Obsidian and terminal themes.

## Web package

```sh
npm install --save-exact https://github.com/trainvent/arcubic/releases/download/0.3.0/trainvent-arcubic-0.3.0.tgz
```

Import `@trainvent/arcubic/styles.css` once, and use `Theme` and components from `@trainvent/arcubic`. The package includes light/dark CSS tokens, Chakra Petch, Lora and Geist Mono fonts, TypeScript declarations and a Next.js client boundary. The preview and package share the component source and base styling. No sibling checkout or font service is required.

The personal Next.js website is the first consumer. Its release URL stays pinned until deliberately updated. See `packages/react/README.md` for integration details.

## Other theme ports

The palette and Obsidian styling remain as in 0.2.2. Download `arcubic-obsidian-0.3.0.zip`, extract its Arcubic folder into `<vault>/.obsidian/themes/`, then select Arcubic in Settings → Appearance → Themes. Minimum Obsidian version: 1.8.0.

The release also includes terminal colors and the separate `theme.css` and `manifest.json` files required by Obsidian’s automatic installer. Shared CSS tokens are inside the web package as `dist/tokens.css`; GitHub displays SHA-256 hashes for each downloadable asset. Arcubic is MIT licensed; bundled fonts retain their included OFL licenses. This remains an alpha release; physical mobile devices and every Obsidian plugin have not been fully validated.

## Release process

Numeric version tags matching package.json run the release workflow. It builds the theme ports, checks the web preview and palette tests, and publishes the matching package archive and companion assets.
