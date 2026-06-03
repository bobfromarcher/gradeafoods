import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, PageHeader, LinkButton, EmptyState } from "@/components/ui";

export default async function TemplatesPage() {
  const user = await requireUser();
  const templates = await prisma.checklistTemplate.findMany({
    where: { organizationId: user.organizationId },
    include: { _count: { select: { items: true, inspections: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Checklists"
        subtitle="Reusable, weighted inspection templates."
        action={<LinkButton href="/templates/new">New checklist</LinkButton>}
      />

      {templates.length === 0 ? (
        <EmptyState
          title="No checklists yet"
          body="Build a weighted checklist of the criteria you grade facilities against."
          action={<LinkButton href="/templates/new">New checklist</LinkButton>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {templates.map((t) => (
            <Link key={t.id} href={`/templates/${t.id}`}>
              <Card className="h-full transition hover:border-brand-300 hover:shadow-md">
                <p className="font-semibold text-ink">{t.name}</p>
                {t.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-ink/60">
                    {t.description}
                  </p>
                )}
                <p className="mt-4 text-xs text-ink/50">
                  {t._count.items} items · used in {t._count.inspections} inspection
                  {t._count.inspections === 1 ? "" : "s"}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
