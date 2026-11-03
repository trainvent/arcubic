# @trainvent/arcubic

React 19 components, CSS tokens and bundled OFL fonts. Import the stylesheet once in your application layout:

```tsx
import '@trainvent/arcubic/styles.css';
import { Theme, Button } from '@trainvent/arcubic';

<Theme appearance="dark"><Button>Get started</Button></Theme>
```

In Next.js, render Theme inside a client provider. The package has a `use client` boundary and includes TypeScript declarations. Theme supplies the Arcubic classes, teal accent, gray neutrals, square geometry and an overlay host for themed portals. Set `appearance` to `light` or `dark`; persistence belongs to the application.

Install from the public npm registry:

```sh
npm install --save-exact @trainvent/arcubic
```

Commit package.json and package-lock.json together. The exact version keeps deployments reproducible; Dependabot can propose new releases in a PR without manually editing either file.

Build with `npm run build:react` or create an installable archive with `npm run pack:react` from the repository root (Node 24). The package version follows the root version. `npm run package:release` includes the React archive with the other theme artifacts. Pushing a numeric version tag matching package.json publishes to npm through `.github/workflows/publish-npm.yml` and creates companion downloads through `.github/workflows/release.yml`.

Maintainer setup is documented in `docs/npm-publishing.md`. GitHub release archives remain an alternative download format; consumers do not need their URLs for normal npm installation.

`styles.css` includes Radix base styles, tokens, components and local fonts. `tokens.css` and `fonts.css` are separate exports for applications needing only those layers. Chakra Petch is the interface font, Lora the reading font, and Geist Mono the code font. Font licenses ship beside the font files.
