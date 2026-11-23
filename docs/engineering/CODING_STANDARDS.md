# Coding standards

Strict TypeScript, domain code in src/features, route files small, UI tokens/components centralized. Keep persistence, data repositories and views separate. No custom native modules or premature microservices. Use pnpm's frozen lockfile for reproduction and Expo install for native package compatibility.

All core UI text uses localization resources, including accessibility labels and notices. Language and region are independent. Use explicit units, currency/origin/version fields; never promote demo prices or synthetic motion to verified/live. Use coarse manually chosen regions, not precise GPS.

No keys, tokens, certificates, .env values, user photos, local DB/browsers or build outputs in Git. Run scripts/security-scan.mjs before pushes; this is a bounded scanner, not a full security audit. Explain actual side effects and failures; no fake remote success.

Format with Prettier; preserve vendor license bytes. Tests focus on behavior/invariants: persistence/migration, filtering, matching, adult/photo eligibility, provenance, translation parity and navigation. Avoid implementation-mirroring tests.
