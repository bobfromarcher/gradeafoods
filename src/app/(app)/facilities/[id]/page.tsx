import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, PageHeader, LinkButton, EmptyState, StatusPill } from "@/components/ui";
import { GradeBadge } from "@/components/GradeBadge";
import { formatDate } from "@/lib/format";
import { FACILITY_TYPE_LABELS, type FacilityType } from "@/lib/constants";

export default async function FacilityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  const facility = await prisma.facility.findFirst({
    where: { id, organizationId: user.organizationId },
    include: {
      inspections: {
        include: { inspector: true },
        orderBy: { conductedAt: "desc" },
      },
    },
  });
  if (!facility) notFound();

  const latest = facility.inspections[0];

  return (
    <div>
      <PageHeader
        title={facility.name}
        subtitle={FACILITY_TYPE_LABELS[facility.type as FacilityType] ?? facility.type}
        action={
          <LinkButton href={`/inspections/new?facility=${facility.id}`}>
            New inspection
          </LinkButton>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <h2 className="text-sm font-semibold text-ink/70">Current grade</h2>
          <div className="mt-3 flex items-center gap-4">
            <GradeBadge grade={latest?.grade ?? "NA"} size="lg" />
            <div>
              <p className="text-sm text-ink/60">
                {latest
                  ? `${latest.scorePercent}% · ${formatDate(latest.conductedAt)}`
                  : "Not yet inspected"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-ink/70">Details</h2>
          <dl className="mt-3 grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-ink/50">Address</dt>
            <dd className="text-ink">{facility.address || "—"}</dd>
            <dt className="text-ink/50">Contact</dt>
            <dd className="text-ink">{facility.contactName || "—"}</dd>
            <dt className="text-ink/50">Email</dt>
            <dd className="text-ink">{facility.contactEmail || "—"}</dd>
          </dl>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 font-semibold text-ink">Inspection history</h2>
        {facility.inspections.length === 0 ? (
          <EmptyState
            title="No inspections"
            body="Run an inspection to give this facility a grade."
            action={
              <LinkButton href={`/inspections/new?facility=${facility.id}`}>
                New inspection
              </LinkButton>
            }
          />
        ) : (
          <Card className="p-0">
            <ul className="divide-y divide-gray-100">
              {facility.inspections.map((i) => (
                <li key={i.id}>
                  <Link
                    href={`/inspections/${i.id}`}
                    className="flex items-center justify-between gap-3 px-5 py-3 transition hover:bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {formatDate(i.conductedAt)}
                      </p>
                      <p className="text-xs text-ink/50">{i.inspector.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm tabular-nums text-ink/60">
                        {i.status === "COMPLETED" ? `${i.scorePercent}%` : ""}
                      </span>
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
    </div>
  );
}
