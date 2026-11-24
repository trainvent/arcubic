# Publishing and consumer updates

Arcubic is published publicly as [`@trainvent/arcubic`](https://www.npmjs.com/package/@trainvent/arcubic). The `trainvent` npm organization and GitHub trusted publisher are configured. Version 0.3.1 verified automatic publication from GitHub Actions, including provenance.

## Publish a release

1. Bump the root package version, for example with `npm version patch --no-git-tag-version`.
2. Run `npm run build:themes` and `npm run build:react` to synchronize the package and Obsidian manifests.
3. Commit the source and generated manifests, create a numeric tag matching package.json, and push the commit and tag.

The tag starts two workflows:

| Workflow | Publishes |
| --- | --- |
| [`publish-npm.yml`](../.github/workflows/publish-npm.yml) | The compiled React package to npm, using GitHub OIDC |
| [`publish-vscode.yml`](../.github/workflows/publish-vscode.yml) | The VS Code extension to the VS Code Marketplace and Open VSX |
| [`release.yml`](../.github/workflows/release.yml) | Obsidian, terminal, VS Code and alternative web-package downloads to GitHub Releases |

The GitHub release notes come from [`release-notes.md`](release-notes.md): its install text plus a *What's new* list of the commit subjects since the previous version tag, so write commit subjects for users. All three build from the tagged source. The npm workflow checks the tag against package.json, runs the palette tests, builds the package and publishes it. No local npm login or stored GitHub npm token is needed for routine releases.

For an interrupted npm publication, use **Actions → Publish Arcubic to npm → Run workflow** and select the existing release tag. npm versions cannot be overwritten; check the registry before retrying an accepted publish. A newly accepted package can take a few minutes to become available for installation.

## VS Code extension stores

The extension is `trainvent.arcubic`. The Marketplace publishes through trusted publishing: a policy on the `trainvent` publisher trusts `trainvent/arcubic` and `publish-vscode.yml`, so no token is stored. Open VSX uses the `OVSX_PAT` secret until its trusted publisher is registered; the workflow switches to trusted publishing as soon as that secret is deleted.

For the one-time setup (publisher, policy, Eclipse account, Open VSX token and namespace), run `scripts/setup-vscode-publishing.sh` from the repository root. Both publish steps skip a version that is already in the store, so **Actions → Publish Arcubic to VS Code extension stores → Run workflow** safely retries a release.

## Consumer projects

```sh
npm install --save-exact @trainvent/arcubic
```

Commit package.json and package-lock.json together. Import `@trainvent/arcubic/styles.css` once and components from `@trainvent/arcubic`. Consumers do not need a GitHub download URL, theme checkout or npm login.

The [personal website](https://github.com/leonmarq/website) is configured to check for Arcubic updates daily at 08:00 Europe/Berlin. Dependabot opens a PR updating the exact version and lockfile; the PR workflow checks the preview server and production build. Merging into master deploys to [leonmarq.com](https://leonmarq.com). This flow requires reviewing and merging updates, rather than editing version files manually.

Other npm projects can enable the same behavior with `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: daily
    allow:
      - dependency-name: '@trainvent/arcubic'
    versioning-strategy: increase
```

## Maintainer access

The trusted publisher is restricted to GitHub repository `trainvent/arcubic`, workflow filename `publish-npm.yml`, with direct npm publishing allowed and no environment restriction. Changing that relationship requires an npm maintainer's interactive authentication; routine releases do not.

For account recovery or moving the workflow, follow [npm's trusted publishing documentation](https://docs.npmjs.com/trusted-publishers/). Keep the package's repository metadata and trusted-publisher settings consistent with its GitHub repository.
