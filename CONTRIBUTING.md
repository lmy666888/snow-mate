# Contributing

Use Node 24 and pnpm 11; install with `pnpm install --frozen-lockfile`. Read docs/engineering/DEVELOPMENT_WORKFLOW.md and DEFINITION_OF_DONE.md. Keep work within this repository, use focused branches/Conventional Commits, and open PRs to main. No direct milestone merge, force push or final tag without owner approval.

Before review: typecheck, lint, unit/UI tests, Web/iOS JS exports, secret scan; SQL policy checks for schema changes. Use fictional data and no production credentials. Document actual device limits. UI changes need actual screenshot artifacts and localization in both supported languages. Never upload real personal photos or .env values to Git.
