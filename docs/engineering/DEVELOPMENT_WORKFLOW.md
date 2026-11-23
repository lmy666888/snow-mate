# Development workflow

1. Fetch and inspect main/status before work; preserve others' edits. Work only in Snowmate.
2. Create one integration branch per milestone, small focused Conventional Commits per feature. No direct development on main.
3. Keep adapters/contracts separate from views. Add acceptance tests for meaningful logic, run typecheck/lint/relevant tests before each substantial commit.
4. Open a draft PR to main with actual screenshots, test outcomes and risks; CI requires no production keys.
5. Owner reviews the milestone. No agent self-approval, automatic merge, release tag, deploy or next milestone. CI green is not approval.
6. After approval only: merge through PR, set final VERSION, create immutable annotated tag, verify remote SHA/tag. GitHub Release is a separate approved action.

M1.0 is the explicit initial-baseline exception authorized by the owner: main and v1.0.0 are the same preserved commit. Governance changes are developed on chore/engineering-governance and included in the M1.1 integration branch, not silently merged to main.
