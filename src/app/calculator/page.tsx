import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { CalculatorForm } from '@/components/CalculatorForm'

export default function CalculatorPage() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/">
          <Logo className="text-lg text-ink" />
        </Link>
        <Link
          href="/"
          className="rounded-lg px-4 py-2 text-sm font-medium text-ink/70 transition hover:text-ink"
        >
          Home
        </Link>
      </header>

      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 pt-12 pb-20">
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Grade Calculator
          </h1>
          <p className="mt-2 text-lg text-ink/70">
            Enter your inspection items to calculate an overall A‑F grade.
          </p>
          <div className="mt-8">
            <CalculatorForm />
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
  )
}
