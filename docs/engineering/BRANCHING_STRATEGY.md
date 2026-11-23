# Branching strategy

GitHub Flow: main is accepted runnable milestone baselines. Current integration branch: `feature/m1.1-social-identity`, created after the governance commit. Optional branches: feature/m1.1-localization, feature/m1.2-motion-engine, feature/m1.3-trip-planner, fix/<issue>, docs/<topic>, chore/<topic>. Prefer one milestone branch unless independent work requires otherwise.

Every substantial change is a focused commit; use feat/fix/test/docs/chore with scope. PR required before merge into main; owner approves milestone merge. Never force-push, delete other branches, move published tags or rewrite release history. Resolve divergence by reviewable merge/rebase only for unpublished work with authorization; stop if stable histories conflict.

Main protection should require `verify` and `database`, one approving review, strict up-to-date checks, resolved conversations, no deletions/force pushes. Check repository configuration rather than treating this document as enforcement; actual API outcome is recorded in GOVERNANCE_STATUS.md. Repository owner cannot self-approve a GitHub PR they authored, so an owner instruction/review record may be needed together with an authorized GitHub reviewer; do not bypass protection automatically.
