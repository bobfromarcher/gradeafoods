# Reviewed release candidate

Author: Bob Robert. November 7, 2026.

This candidate replaces production-on-push with an explicit release request. It is prepared locally and is not evidence of a deployed fix. The current default branch remains `devin/1780058740-grade-a-foods-mvp`; no branch rename is needed.

## Behavior

Ordinary pushes and pull requests run the `ci` workflow's existing `test` job. Installation uses the package lock without fallback or lifecycle scripts. Prisma generation is explicit and does not migrate a database. Release-authorization tests, a runtime dependency advisory gate, lint, type checks, payment regression tests and the application build must succeed.

The `reviewed-production` workflow is manual. Its default mode is `validate`, which cannot start the publish job. An owner-requested production run must name the full workflow commit SHA and run from the exact release branch. Verification checks the actual checkout against that SHA before installing application dependencies. Publishing requires successful verification and an explicit authorization output. The publish job repeats the source check, uses locked provider tools and references `production-reviewed` for a final approval boundary. Configure that environment before enabling this workflow for production.

Provider tokens are supplied only to configuration retrieval and publication steps, not to ordinary CI or the Vercel build step. Production application environment variables are still read from the provider's locally pulled configuration during the approved build. Do not upload that configuration or build logs as generic artifacts.

## Necessary application repairs

- Next.js and its matching lint package are pinned to 16.4.1 to address the critical dependency advisories found in the old 16.2.6 source. Compatible dependency fixes update the lockfile without forced major changes.
- Stripe initialization is lazy. Imports and builds work without a payment API key; an actual billing operation still fails closed if configuration is missing.
- Webhooks require a configured signing secret and a valid signature. Unconfigured callbacks return 503; missing or invalid signatures return 400. Signature checking is local and does not require the payment API key. Multiple signing secrets remain supported for rotation.
- Two internal home links use Next Link so the existing lint check passes. Policy text is otherwise retained.

Ten payment tests use only synthetic keys/events and make no provider requests. Twelve release-authorization tests exercise valid requests and rejected triggers, actors, refs, confirmations and checkout mismatches.

## Setup and verification before a production release

1. Review this source and the lockfiles. Run `npm ci --ignore-scripts`, `npm exec --offline -- prisma generate`, `npm run lint`, `npm run typecheck`, `npm test`, `npm audit --omit=dev --audit-level=high` and `npm run build`. The workflow uses Node 24; local verification uses Node 24.14.1.
2. Verify the actual Vercel project, root directory, Node version, domains and source branch. Old standalone and monorepo GradeAFoods projects coexist. A deployment receipt from June does not identify today's customer-facing source.
3. Configure `production-reviewed` with Bob Robert as a required reviewer, prevent administrative bypass, and restrict deployment branches to the exact release branch. The sole owner must be allowed to approve their own requested release. Move provider credentials to that environment where supported and verify the original repository secret copies are retired after consumer migration.
4. Audit the Vercel Git integration. Direct provider auto-deploy can bypass GitHub's publish job. Preserve previews if needed, but require the approved production route for the real domains.
5. Review and merge through the approved process, then execute a hosted `validate` run without provider credentials. Verify actual environment approval behavior before accepting the release gate. Local syntax/unit/build checks do not prove hosted approval works.
6. Only after those checks, approve branch/Actions restrictions and a separate real production release if desired. Do not disable the existing path before the replacement is verified.

Current plan limit: environment reviewers and branch protection on GitHub Free are available for this public repository. A switch to private source needs a plan or a separately verified release-control design; do not silently remove this boundary by changing visibility.

Counterargument: extra release steps can slow fixes or block a valid build. The workflow preserves a credential-free validation path, checks missing configuration explicitly and retains the source SHA. Reversal requires deliberate review rather than an automatic fallback to ungated deployment.

This patch does not establish the real provider configuration, complete billing fulfillment or live delivery readiness. In particular, the callback acknowledges verified events but does not implement subscription entitlement provisioning.

References: [GitHub environment review](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/review-deployments), [GitHub workflow security](https://docs.github.com/en/actions/reference/security/secure-use), [Vercel local build](https://vercel.com/docs/cli/build). Those mechanisms informed independent credential separation and manual authorization; no third-party application source was copied.
