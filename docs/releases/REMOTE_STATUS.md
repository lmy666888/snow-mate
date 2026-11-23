# Remote status · M1.1 review candidate

- Repository: https://github.com/lmy666888/snow-mate
- Stable main / annotated v1.0.0 target: fda899348c0740242c67ad46307c1232b9fdd598 (M1.0).
- Development branch: feature/m1.1-social-identity.
- PR: https://github.com/lmy666888/snow-mate/pull/1
- Latest application-code commit: 6a74efc0c12f3241d0a477e0d7650d4300f7bef8, remotely pushed and independently CI-verified.
- Source-code CI: https://github.com/lmy666888/snow-mate/actions/runs/45131312960 (verify + database success).
- Review artifacts are committed after the code SHA. The exact current artifact HEAD is resolved from Git/PR, not hardcoded into a self-referencing commit. Final owner handoff reports the independently confirmed current HEAD.
- Local final check set: 11 unit, 9 UI, 29 SQL assertions, typecheck/lint, compatible deps, Expo Doctor 20/20, Web + iOS JS exports.
- Main protection enforced: verify/database, strict up-to-date checks, one approval, admins included, no force-push/deletion, resolved conversations.
- Owner accepted M1.1 as a Demo Release Candidate on 2026-11-23. Independent GitHub approval is still required; main has not advanced and no v1.1.0 tag/release is claimed. See M1.1_APPROVAL.md and M1.1_RELEASE_STATUS.md for the current conditional process.
- No production deployment, visibility change, force-push or published-history rewrite. Native iPhone test unavailable.

Independent confirmation commands:

```sh
git status --short --branch
git rev-parse HEAD
git ls-remote origin refs/heads/main refs/heads/feature/m1.1-social-identity refs/tags/v1.0.0 'refs/tags/v1.0.0^{}'
gh pr view 1 --repo lmy666888/snow-mate --json headRefOid,isDraft,state,statusCheckRollup
gh api repos/lmy666888/snow-mate/branches/main/protection
```

A green CI check is not owner approval. After approving product scope, the owner must still follow protected PR merge/release procedure; GitHub does not count a PR author's self-approval.
