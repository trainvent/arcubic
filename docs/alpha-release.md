# Arcubic 0.3.1 — npm publishing

Arcubic is now available as the public npm package `@trainvent/arcubic`:

```sh
npm install --save-exact @trainvent/arcubic@0.3.1
```

Import `@trainvent/arcubic/styles.css` once, and import `Theme` and components from `@trainvent/arcubic`. The package includes light/dark tokens, bundled fonts, TypeScript declarations and the Next.js client boundary. The component styling is unchanged from 0.3.0.

Numeric version tags now publish to npm through GitHub's configured trusted publisher, without storing an npm token in GitHub. Website consumers can use Dependabot to propose exact-version updates to package.json and package-lock.json, with build checks before merging and deployment.

## Other downloads

The Obsidian ZIP and terminal colors remain available. The separate `theme.css` and `manifest.json` files are required by Obsidian's automatic installer. The web package archive is an alternative to npm installation; shared CSS tokens are included inside it. GitHub displays SHA-256 hashes for its downloadable assets.

For manual Obsidian installation, extract `arcubic-obsidian-0.3.1.zip` into `<vault>/.obsidian/themes/` and select Arcubic in Settings → Appearance → Themes. Minimum Obsidian version: 1.8.0. Arcubic is MIT licensed; bundled fonts retain their OFL licenses. This remains an alpha release.
