export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold ${className}`}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-sm font-bold text-white shadow-sm">
        A+
      </span>
      <span className="tracking-tight">
        Grade<span className="text-brand-600">A</span>Foods
      </span>
    </span>
  );
}
