# Governance status — 2026-11-23

M1.0 remotely confirmed at fda899348c0740242c67ad46307c1232b9fdd598, main and v1.0.0. Governance is an unmerged development change, carried into M1.1 integration.

GitHub API successfully configured main protection: required checks `verify` and `database`, strict up-to-date checks, one approving review, stale approvals dismissed, admin enforcement enabled, resolved conversations required, force-push/deletions disallowed. This is actual API-confirmed enforcement, not only documentation. No main updates after establishing protection.

The repository owner is also the PR author for token-created PRs; GitHub will not count the author's self-approval. A separate authorized reviewer may be necessary to satisfy the configured approval requirement. Agent will not weaken protection or bypass it without explicit owner direction.

CI/PR template and workflow docs exist on the development line. CI execution status is reported only after GitHub runs; local checks are not passed off as hosted CI.

VERSION is authoritative; `pnpm version:sync` updates root/mobile manifests and `pnpm version:check` detects drift. `app.config.ts` derives Expo numeric version plus milestone/dev/SHA metadata from VERSION and Git, and uses unknown for source archives without Git. No manually fabricated SHA. A new bundle/config evaluation is required after a new commit to refresh build metadata.
