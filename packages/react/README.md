# @trainvent/arcubic

React 19 components, CSS tokens and bundled OFL fonts. Import the stylesheet once in your application layout:

```tsx
import '@trainvent/arcubic/styles.css';
import { Theme, Button } from '@trainvent/arcubic';

<Theme appearance="dark"><Button>Get started</Button></Theme>
```

In Next.js, render Theme inside a client provider. The package has a `use client` boundary and includes TypeScript declarations. Theme supplies the Arcubic classes, teal accent, gray neutrals, square geometry and an overlay host for themed portals. Set `appearance` to `light` or `dark`; persistence belongs to the application.

Install the versioned GitHub release package:

```sh
npm install --save-exact https://github.com/trainvent/arcubic/releases/download/0.3.0/trainvent-arcubic-0.3.0.tgz
```

The archive contains the compiled package, so consumers need no theme checkout or build tooling. Commit package.json and package-lock.json together; the URL pins the release and the lockfile verifies its integrity.

Build with `npm run build:react` or create an installable archive with `npm run pack:react` from the repository root (Node 24). The package version follows the root version. `npm run package:release` includes the React archive with the other theme artifacts. Pushing a numeric version tag matching package.json builds and publishes the release through `.github/workflows/release.yml`.

The package is also ready for npm registry publication with `npm publish ./packages/react` after building and authenticating to an npm account with access to the `@trainvent` scope. GitHub release installation needs no npm publisher account.

`styles.css` includes Radix base styles, tokens, components and local fonts. `tokens.css` and `fonts.css` are separate exports for applications needing only those layers. Chakra Petch is the interface font, Lora the reading font, and Geist Mono the code font. Font licenses ship beside the font files.
