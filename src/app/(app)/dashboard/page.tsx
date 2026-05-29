import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, PageHeader, LinkButton, EmptyState, StatusPill } from "@/components/ui";
import { GradeBadge } from "@/components/GradeBadge";
import { formatDate } from "@/lib/format";

const GRADES = ["A", "B", "C", "F"] as const;

export default async function DashboardPage() {
  const user = await requireUser();
  const orgId = user.organizationId;

  const [facilityCount, inspections] = await Promise.all([
    prisma.facility.count({ where: { organizationId: orgId } }),
    prisma.inspection.findMany({
      where: { organizationId: orgId },
      include: { facility: true, inspector: true },
      orderBy: { conductedAt: "desc" },
    }),
  ]);

  const completed = inspections.filter((i) => i.status === "COMPLETED");
  const avgScore =
    completed.length > 0
      ? Math.round(
          (completed.reduce((sum, i) => sum + i.scorePercent, 0) /
            completed.length) *
            10,
        ) / 10
      : null;

  const distribution = GRADES.map((g) => ({
    grade: g,
    count: completed.filter((i) => i.grade === g).length,
  }));
  const maxCount = Math.max(1, ...distribution.map((d) => d.count));

  const stats = [
    { label: "Facilities", value: facilityCount },
    { label: "Inspections", value: inspections.length },
    { label: "Completed", value: completed.length },
    { label: "Avg. score", value: avgScore === null ? "—" : `${avgScore}%` },
  ];

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user.name.split(" ")[0]}`}
        subtitle="Your food-safety program at a glance."
        action={<LinkButton href="/inspections/new">New inspection</LinkButton>}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <p className="text-sm text-ink/55">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-ink">{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <h2 className="font-semibold text-ink">Grade distribution</h2>
          <p className="text-xs text-ink/50">Completed inspections</p>
          {completed.length === 0 ? (
            <p className="mt-6 text-sm text-ink/50">No completed inspections yet.</p>
          ) : (
            <div className="mt-5 space-y-3">
              {distribution.map((d) => (
                <div key={d.grade} className="flex items-center gap-3">
                  <GradeBadge grade={d.grade} size="sm" />
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{ width: `${(d.count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-sm tabular-nums text-ink/70">
                    {d.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-ink">Recent inspections</h2>
            <Link
              href="/inspections"
              className="text-sm font-medium text-brand-700 hover:underline"
            >
              View all
            </Link>
          </div>
          {inspections.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title="No inspections yet"
                body="Start your first inspection to generate a grade."
                action={
                  <LinkButton href="/inspections/new">New inspection</LinkButton>
                }
              />
            </div>
          ) : (
            <ul className="mt-3 divide-y divide-gray-100">
              {inspections.slice(0, 6).map((i) => (
                <li key={i.id}>
                  <Link
                    href={`/inspections/${i.id}`}
                    className="flex items-center justify-between gap-3 py-3 transition hover:opacity-80"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink">
                        {i.facility.name}
                      </p>
                      <p className="text-xs text-ink/50">
                        {formatDate(i.conductedAt)} · {i.inspector.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusPill status={i.status} />
                      <GradeBadge grade={i.grade} size="sm" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
