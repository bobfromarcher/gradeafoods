'use client'

import { useState, useTransition } from 'react'
import { captureEmail } from '@/app/email/actions'

export function EmailCapture() {
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await captureEmail(formData)
      setMessage(result.message)
    })
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <label htmlFor="email" className="sr-only">
        Email address
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        placeholder="you@example.com"
        className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm text-ink placeholder:text-ink/40 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Submitting…' : 'Notify me'}
      </button>
      {message && (
        <p className="text-sm text-ink/70 sm:col-span-2">{message}</p>
      )}
    </form>
  )
}
