# npm publishing

The public package is `@trainvent/arcubic`. Its source stays in this public GitHub repository. Numeric release tags run `.github/workflows/publish-npm.yml`, which builds the package from the tag and publishes to the npm registry using GitHub OIDC. It requires no stored npm token. The existing GitHub release workflow independently publishes the theme-port downloads.

## One-time setup

1. Create and verify an account at https://www.npmjs.com/signup.
2. Create the `trainvent` organization using the free public-packages plan, or obtain publishing access if it is already owned by your organization.
3. Run `npm login --registry=https://registry.npmjs.org` locally and complete its browser authentication. Do not paste credentials into chat or commit them.
4. Bootstrap the package once: `npm run pack:react`, then `npm publish dist/trainvent-arcubic-0.3.0.tgz --access public`. Complete npm's authentication prompt if requested.
5. In the package's npm settings, add a GitHub Actions trusted publisher:
   - Organization/user: `trainvent`
   - Repository: `arcubic`
   - Workflow filename: `publish-npm.yml`
   - Environment: leave empty
   - Allow direct `npm publish`.

The workflow is prepared now; registry publishing remains pending until the npm account, scope and trusted publisher are configured. Do not trigger a new version tag before completing setup.

## Releases

Update the root package version, build the theme ports to synchronize manifests, and commit. Push the matching numeric tag. The npm workflow checks that its tag matches package.json before publishing. Its manual Run workflow option can publish an existing release tag when recovering an interrupted release; it cannot overwrite a version already published to npm.

Website consumers install an exact version with `npm install --save-exact @trainvent/arcubic@0.3.0`. Dependabot can then update package.json and package-lock.json in a pull request, with build checks before merging and deployment. The GitHub archive remains usable during the registry migration.

References: [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/), [creating an npm organization](https://docs.npmjs.com/creating-an-organization/).
