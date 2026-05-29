import Link from "next/link";
import { Logo } from "@/components/Logo";
import { getSessionUser } from "@/lib/auth";

const FEATURES = [
  {
    title: "Configurable checklists",
    body: "Build weighted inspection templates with critical-control points for any facility type — restaurants, processors, warehouses, farms.",
  },
  {
    title: "Instant letter grades",
    body: "Every inspection is scored automatically. A failed critical item caps the grade at F, just like real health-code scoring.",
  },
  {
    title: "Supplier compliance",
    body: "Track every facility's grade history and spot trends before they become recalls, fines, or failed audits.",
  },
  {
    title: "Audit-ready reports",
    body: "Generate clean, printable inspection reports your customers, regulators, and investors can trust.",
  },
];

const STATS = [
  { value: "A–F", label: "Standardized grading" },
  { value: "100%", label: "Digital paper trail" },
  { value: "Multi-site", label: "Org-wide visibility" },
];

export default async function Home() {
  const user = await getSessionUser();

  return (
    <div className="flex min-h-full flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Logo className="text-lg text-ink" />
        <nav className="flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              Open dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-ink/70 transition hover:text-ink"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid w-full max-w-6xl gap-12 px-6 pt-12 pb-20 lg:grid-cols-2 lg:items-center lg:pt-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-800">
              Food safety &amp; quality grading platform
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Grade every facility.
              <br />
              <span className="text-brand-600">Trust every supplier.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink/70">
              Grade A Foods turns food-safety inspections into standardized
              letter grades. Run weighted checklists, flag critical violations,
              and produce audit-ready reports in minutes — not spreadsheets.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={user ? "/dashboard" : "/register"}
                className="rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
              >
                {user ? "Go to dashboard" : "Start grading free"}
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-brand-200 bg-white px-5 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                Sign in
              </Link>
            </div>
            <dl className="mt-12 grid grid-cols-3 gap-6">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="text-2xl font-bold text-ink">{s.value}</dt>
                  <dd className="text-sm text-ink/60">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-xl shadow-brand-900/5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <p className="text-sm text-ink/50">Inspection report</p>
                  <p className="font-semibold text-ink">Riverside Kitchen</p>
                </div>
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-emerald-100 text-2xl font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  A
                </span>
              </div>
              <ul className="mt-4 space-y-3 text-sm">
                {[
                  ["Cold holding ≤ 41°F", true],
                  ["Handwashing stations stocked", true],
                  ["Allergen labeling present", true],
                  ["Pest control log current", false],
                ].map(([label, pass]) => (
                  <li
                    key={label as string}
                    className="flex items-center justify-between"
                  >
                    <span className="text-ink/80">{label}</span>
                    <span
                      className={
                        pass
                          ? "font-medium text-brand-600"
                          : "font-medium text-amber-600"
                      }
                    >
                      {pass ? "Pass" : "Needs attention"}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-lg bg-brand-50 p-3 text-sm text-brand-800">
                Weighted score <strong>92.5%</strong> · 0 critical violations
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-brand-100 bg-white">
          <div className="mx-auto w-full max-w-6xl px-6 py-16">
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              Everything you need to run a compliance program
            </h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f) => (
                <div key={f.title}>
                  <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-brand-100 font-bold text-brand-700">
                    ✓
                  </div>
                  <h3 className="font-semibold text-ink">{f.title}</h3>
                  <p className="mt-1 text-sm text-ink/65">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-6 py-8 text-sm text-ink/50">
        <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-6 sm:flex-row">
          <Logo className="text-ink/70" />
          <p>© {new Date().getFullYear()} Grade A Foods. A de Montfort company.</p>
        </div>
      </footer>
    </div>
  );
}
