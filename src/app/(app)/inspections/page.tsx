import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, PageHeader, LinkButton, EmptyState, StatusPill } from "@/components/ui";
import { GradeBadge } from "@/components/GradeBadge";
import { formatDate } from "@/lib/format";

export default async function InspectionsPage() {
  const user = await requireUser();
  const inspections = await prisma.inspection.findMany({
    where: { organizationId: user.organizationId },
    include: { facility: true, template: true, inspector: true },
    orderBy: { conductedAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Inspections"
        subtitle="Every graded inspection across your facilities."
        action={<LinkButton href="/inspections/new">New inspection</LinkButton>}
      />

      {inspections.length === 0 ? (
        <EmptyState
          title="No inspections yet"
          body="Pick a facility and a checklist to run your first graded inspection."
          action={<LinkButton href="/inspections/new">New inspection</LinkButton>}
        />
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-gray-100">
            {inspections.map((i) => (
              <li key={i.id}>
                <Link
                  href={`/inspections/${i.id}`}
                  className="flex items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-gray-50"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">
                      {i.facility.name}
                    </p>
                    <p className="text-xs text-ink/50">
                      {i.template.name} · {formatDate(i.conductedAt)} · {i.inspector.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {i.status === "COMPLETED" && (
                      <span className="text-sm tabular-nums text-ink/60">
                        {i.scorePercent}%
                      </span>
                    )}
                    <StatusPill status={i.status} />
                    <GradeBadge grade={i.grade} size="sm" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
