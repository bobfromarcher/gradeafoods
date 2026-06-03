import Link from "next/link";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink/60">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const styles =
    variant === "primary"
      ? "bg-brand-600 text-white hover:bg-brand-700"
      : "border border-gray-200 bg-white text-ink/80 hover:bg-gray-50";
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition ${styles}`}
    >
      {children}
    </Link>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
      <p className="font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-ink/60">{body}</p>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const completed = status === "COMPLETED";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        completed
          ? "bg-brand-100 text-brand-800"
          : "bg-amber-100 text-amber-800"
      }`}
    >
      {completed ? "Completed" : "Draft"}
    </span>
  );
}
