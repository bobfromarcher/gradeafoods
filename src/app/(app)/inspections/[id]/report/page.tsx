import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Logo } from "@/components/Logo";
import { GradeBadge } from "@/components/GradeBadge";
import { formatDateTime } from "@/lib/format";
import { RESULT_STATUS_LABELS, type ResultStatus } from "@/lib/constants";
import { PrintButton } from "./PrintButton";

const STATUS_TEXT: Record<ResultStatus, string> = {
  PASS: "text-brand-700",
  FAIL: "text-red-600",
  NA: "text-ink/40",
};

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  const inspection = await prisma.inspection.findFirst({
    where: { id, organizationId: user.organizationId },
    include: {
      facility: true,
      template: true,
      inspector: true,
      organization: true,
      results: { include: { item: true } },
    },
  });
  if (!inspection) notFound();

  const items = [...inspection.results].sort(
    (a, b) => a.item.order - b.item.order,
  );
  const categories = new Map<string, typeof items>();
  for (const r of items) {
    const list = categories.get(r.item.category) ?? [];
    list.push(r);
    categories.set(r.item.category, list);
  }
  const failures = items.filter((r) => r.status === "FAIL");

  return (
    <div>
      <div className="no-print mb-6 flex items-center justify-between">
        <Link
          href={`/inspections/${inspection.id}`}
          className="text-sm font-medium text-brand-700 hover:underline"
        >
          ← Back to inspection
        </Link>
        <PrintButton />
      </div>

      <article className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-10 shadow-sm">
        <header className="flex items-start justify-between border-b border-gray-200 pb-6">
          <div>
            <Logo className="text-lg text-ink" />
            <h1 className="mt-4 text-2xl font-bold text-ink">
              Inspection Report
            </h1>
            <p className="text-sm text-ink/55">{inspection.organization.name}</p>
          </div>
          <div className="text-center">
            <GradeBadge grade={inspection.grade} size="lg" />
            <p className="mt-2 text-sm font-semibold text-ink">
              {inspection.scorePercent}%
            </p>
          </div>
        </header>

        <dl className="grid grid-cols-2 gap-y-3 py-6 text-sm">
          <dt className="text-ink/50">Facility</dt>
          <dd className="font-medium text-ink">{inspection.facility.name}</dd>
          <dt className="text-ink/50">Checklist</dt>
          <dd className="text-ink">{inspection.template.name}</dd>
          <dt className="text-ink/50">Inspector</dt>
          <dd className="text-ink">{inspection.inspector.name}</dd>
          <dt className="text-ink/50">Date</dt>
          <dd className="text-ink">{formatDateTime(inspection.conductedAt)}</dd>
          <dt className="text-ink/50">Critical violations</dt>
          <dd className={failures.some((f) => f.item.critical) ? "font-semibold text-red-600" : "text-ink"}>
            {failures.filter((f) => f.item.critical).length}
          </dd>
        </dl>

        {[...categories.entries()].map(([category, list]) => (
          <section key={category} className="border-t border-gray-100 py-4">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/50">
              {category}
            </h2>
            <ul className="space-y-2">
              {list.map((r) => (
                <li key={r.id} className="text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-ink">
                      {r.item.text}
                      {r.item.critical && (
                        <span className="ml-1 text-xs font-medium text-red-600">
                          (critical)
                        </span>
                      )}
                    </span>
                    <span
                      className={`shrink-0 font-semibold ${
                        STATUS_TEXT[r.status as ResultStatus] ?? "text-ink"
                      }`}
                    >
                      {RESULT_STATUS_LABELS[r.status as ResultStatus] ?? r.status}
                    </span>
                  </div>
                  {r.note && (
                    <p className="mt-0.5 text-xs text-ink/55">Note: {r.note}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}

        {inspection.notes && (
          <section className="border-t border-gray-100 py-4">
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink/50">
              Inspector notes
            </h2>
            <p className="text-sm text-ink/80">{inspection.notes}</p>
          </section>
        )}

        <footer className="mt-6 border-t border-gray-200 pt-4 text-xs text-ink/45">
          Generated by Grade A Foods · Report ID {inspection.id}
        </footer>
      </article>
    </div>
  );
}
