import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, PageHeader, LinkButton, EmptyState } from "@/components/ui";
import { GradeBadge } from "@/components/GradeBadge";
import { FACILITY_TYPE_LABELS, type FacilityType } from "@/lib/constants";

export default async function FacilitiesPage() {
  const user = await requireUser();
  const facilities = await prisma.facility.findMany({
    where: { organizationId: user.organizationId },
    include: {
      inspections: { orderBy: { conductedAt: "desc" }, take: 1 },
      _count: { select: { inspections: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Facilities"
        subtitle="Suppliers and sites in your compliance program."
        action={<LinkButton href="/facilities/new">Add facility</LinkButton>}
      />

      {facilities.length === 0 ? (
        <EmptyState
          title="No facilities yet"
          body="Add a restaurant, processor, warehouse, farm, or retailer to start inspecting it."
          action={<LinkButton href="/facilities/new">Add facility</LinkButton>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {facilities.map((f) => {
            const latest = f.inspections[0];
            return (
              <Link key={f.id} href={`/facilities/${f.id}`}>
                <Card className="h-full transition hover:border-brand-300 hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">{f.name}</p>
                      <p className="text-xs text-ink/55">
                        {FACILITY_TYPE_LABELS[f.type as FacilityType] ?? f.type}
                      </p>
                    </div>
                    <GradeBadge grade={latest?.grade ?? "NA"} />
                  </div>
                  <p className="mt-4 text-xs text-ink/50">
                    {f._count.inspections} inspection
                    {f._count.inspections === 1 ? "" : "s"}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
