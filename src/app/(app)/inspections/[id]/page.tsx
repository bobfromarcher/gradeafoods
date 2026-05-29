import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { InspectionForm } from "./InspectionForm";

export default async function InspectionPage({
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
      results: { include: { item: true } },
    },
  });
  if (!inspection) notFound();

  const items = inspection.results
    .map((r) => ({
      itemId: r.itemId,
      category: r.item.category,
      text: r.item.text,
      weight: r.item.weight,
      critical: r.item.critical,
      order: r.item.order,
      status: r.status,
      note: r.note ?? "",
    }))
    .sort((a, b) => a.order - b.order);

  return (
    <div>
      <PageHeader
        title={inspection.facility.name}
        subtitle={`${inspection.template.name} · ${formatDate(
          inspection.conductedAt,
        )} · ${inspection.inspector.name}`}
        action={
          inspection.status === "COMPLETED" ? (
            <Link
              href={`/inspections/${inspection.id}/report`}
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-ink/80 shadow-sm transition hover:bg-gray-50"
            >
              View report
            </Link>
          ) : undefined
        }
      />

      <InspectionForm
        inspectionId={inspection.id}
        status={inspection.status}
        defaultNotes={inspection.notes ?? ""}
        items={items}
      />
    </div>
  );
}
