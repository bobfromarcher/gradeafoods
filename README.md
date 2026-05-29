# Grade A Foods

Food-safety & quality-grading SaaS for [gradeafoods.com](https://gradeafoods.com).
Inspect facilities against weighted checklists, generate standardized letter
grades (A–F), track supplier compliance over time, and produce audit-ready
reports.

## Features

- **Organizations & auth** — email/password sign-up creates an organization;
  sessions are signed JWTs stored in an httpOnly cookie.
- **Facilities** — register restaurants, processors, warehouses, farms, and
  retailers.
- **Checklists** — build reusable, weighted inspection templates. Mark
  critical-control points that cap the grade at **F** when failed.
- **Inspections** — run a checklist against a facility with Pass / Fail / N/A
  per item, a live grade preview, and inspector notes.
- **Grading** — weighted scoring (`earned ÷ applicable weight`) with thresholds
  A ≥ 90, B ≥ 80, C ≥ 70, otherwise F. Any failed critical item forces an F.
- **Reports** — clean, printable per-inspection audit reports.
- **Dashboard** — grade distribution, average score, and recent activity.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Prisma 7](https://www.prisma.io/) with the libSQL driver adapter (SQLite locally)
- `jose` (session JWTs) + `bcryptjs` (password hashing) + `zod` (validation)

## Getting started

```bash
npm install
cp .env.example .env        # then edit AUTH_SECRET
npm run db:migrate          # create the SQLite database
npm run db:seed             # load demo organization + sample inspections
npm run dev
```

Open http://localhost:3000.

**Demo login:** `demo@gradeafoods.com` / `demo1234`

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Generate the Prisma client and build for production |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:migrate` | Apply migrations (dev) |
| `npm run db:deploy` | Apply migrations (prod/CI) |
| `npm run db:seed` | Seed demo data |
| `npm run db:reset` | Drop, re-migrate, and reseed |

## Grading model

Each applicable (non-N/A) checklist item contributes its `weight` to the
denominator and, when passed, to the numerator:

```
score% = round( earnedWeight / applicableWeight * 100 )
```

Any failed item flagged `critical` forces the overall grade to **F**, mirroring
real health-code scoring.

## Production notes

SQLite is used for local development. For production, point `DATABASE_URL` at a
hosted [libSQL/Turso](https://turso.tech/) database (the adapter is already
wired up) or change the Prisma datasource provider to `postgresql`.
