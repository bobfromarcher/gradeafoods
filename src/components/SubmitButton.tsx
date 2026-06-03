"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {pending ? "Working…" : children}
    </button>
  );
}
