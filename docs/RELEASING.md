# Versioning and releases

Every successful deployment from `main` publishes a GitHub Release. In normal
development, that means merging a pull request deploys and releases the same
commit. The release is created only after GitHub Pages reports a successful
deployment.

## Version source

Git tags are the canonical version source. Release tags use `vMAJOR.MINOR.PATCH`,
for example `v0.4.2`. `package.json` remains private package metadata and does
not drive releases.

The workflow reads every commit since the highest reachable release tag and
selects the largest required bump:

| Commit | Bump |
| --- | --- |
| `feat!: ...` or a `BREAKING CHANGE:` footer | major |
| `feat: ...` | minor |
| `fix: ...`, `docs: ...`, and all other commits | patch |

Pull request titles should therefore use the repository's Conventional Commit
format. Both squash-merge titles and conventional titles inside merge commits
are recognized.

An unversioned history starts at `v0.1.0` when it contains a feature, or
`v0.0.1` for patch-only changes.

## Release flow

The `Deploy to GitHub Pages` workflow:

1. Fetches the full tag history.
2. Computes the next version with `scripts/release-version.mjs`.
3. Builds and deploys the app with that version in `version.js`.
4. Creates the matching tag and GitHub Release with generated notes.

Re-running a deployment is safe: when a release tag already points at the
commit, the same version is reused, and an existing GitHub Release is skipped.
A manual workflow dispatch deploys the commit SHA and does not create a release.

Check the next version locally with:

```bash
npm run release:version
```
