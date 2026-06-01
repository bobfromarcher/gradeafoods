import Link from "next/link";
import { Logo } from "@/components/Logo";
import { getSessionUser } from "@/lib/auth";
import { EmailCapture } from "@/components/EmailCapture";

const FEATURES = [
  {
    title: "Food Database & Scoring",
    body: "Access 50,000+ food items with detailed nutritional profiles, contamination tracking, and real-time Grade A Foods Score (0-100) for safety, quality, compliance, and transparency.",
  },
  {
    title: "Contamination Tracking",
    body: "Monitor heavy metals, pesticides, microbial contaminants, and allergens across your supply chain with real-time alerts and predictive risk modeling.",
  },
  {
    title: "Automated Authority Reporting",
    body: "Automatically report food safety issues to FDA, USDA, CDC, and other regulatory authorities with pre-filled forms and required documentation.",
  },
  {
    title: "Food Fraud Detection",
    body: "AI-powered detection of ingredient substitution, geographic origin fraud, and supply chain anomalies with historical fraud database integration.",
  },
  {
    title: "Supplier Compliance Management",
    body: "Comprehensive supplier scoring, risk assessment, certification verification, and performance tracking with automated audit scheduling.",
  },
  {
    title: "Recall Management",
    body: "End-to-end recall planning, execution, distribution tracking, customer notification, and post-recall analysis with regulatory reporting.",
  },
];

const STATS = [
  { value: "50,000+", label: "Food items tracked" },
  { value: "100%", label: "Automated reporting" },
  { value: "AI-Powered", label: "Fraud detection" },
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
              Comprehensive food compliance & safety platform
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Food safety transparent.
              <br />
              <span className="text-brand-600">Compliance automated.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink/70">
              Grade A Foods provides end-to-end food compliance tracking from farm to table. Monitor contamination, track regulatory compliance, detect food fraud, and automatically report to authorities — all in one platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/calculator"
                className="rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
              >
                Calculate your grade
              </Link>
              {user ? (
                <Link
                  href="/dashboard"
                  className="rounded-lg border border-brand-200 bg-white px-5 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
                >
                  Go to dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="rounded-lg border border-brand-200 bg-white px-5 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
                >
                  Sign in
                </Link>
              )}
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
                  <p className="text-sm text-ink/50">Compliance Score</p>
                  <p className="font-semibold text-ink">Organic Spinach</p>
                </div>
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-emerald-100 text-2xl font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  94
                </span>
              </div>
              <ul className="mt-4 space-y-3 text-sm">
                {[
                  ["Safety Score", "96/100", true],
                  ["Quality Score", "92/100", true],
                  ["Compliance Score", "95/100", true],
                  ["Transparency Score", "93/100", true],
                ].map(([label, score, pass]) => (
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
                      {score}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-lg bg-brand-50 p-3 text-sm text-brand-800">
                <strong>Zero contamination alerts</strong> · All certifications valid
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-brand-100 bg-white">
          <div className="mx-auto w-full max-w-6xl px-6 py-16">
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              Everything you need for complete food compliance
            </h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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

        <section className="border-t border-brand-100 bg-white">
          <div className="mx-auto w-full max-w-6xl px-6 py-16">
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              Stay in the loop
            </h2>
            <p className="mt-2 text-ink/70">
              Be the first to know when we launch new features and get early access.
            </p>
            <div className="mt-6 max-w-md">
              <EmailCapture />
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
