# Release process

VERSION is the authoritative application SemVer (development may use 1.1.0-dev). Build metadata derives milestone label and short SHA from VERSION and Git using scripts/build-metadata.mjs (generated ignored JSON) and Expo config; package/app configuration is derived or synchronized, not manually used as competing authority. Milestone M1.1 maps to final v1.1.0 only when approved. GitHub Releases require approval separately.

1. Confirm scope and owner approval. Require clean reviewed PR and passing checks.
2. Review secrets/current tree/history, migrations, provenance, real device status and release blockers.
3. Set final VERSION and update CHANGELOG/release notes/status, run complete checks.
4. Merge via approved PR; never force-push stable branches.
5. Create annotated final tag on accepted main; inspect existing tags, never move them.
6. Push and independently verify branch/tag SHA and accessible contents. Do not claim a Release/deployment without actual confirmed action.

M1.0 v1.0.0 is already preserved. M1.1 owner acceptance authorizes a Demo Release Candidate merge/tag only after the existing independent-review and CI requirements are satisfied; see M1.1_APPROVAL.md. No production release is authorized. Native iOS signing/build number and store submission are future explicit release tasks; an Expo JS bundle is not an App Store build.
