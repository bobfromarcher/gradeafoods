import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, PageHeader, LinkButton } from "@/components/ui";

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  const template = await prisma.checklistTemplate.findFirst({
    where: { id, organizationId: user.organizationId },
    include: { items: { orderBy: { order: "asc" } } },
  });
  if (!template) notFound();

  const totalWeight = template.items.reduce((sum, i) => sum + i.weight, 0);
  const byCategory = new Map<string, typeof template.items>();
  for (const item of template.items) {
    const list = byCategory.get(item.category) ?? [];
    list.push(item);
    byCategory.set(item.category, list);
  }

  return (
    <div>
      <PageHeader
        title={template.name}
        subtitle={template.description ?? undefined}
        action={<LinkButton href="/inspections/new">Use in inspection</LinkButton>}
      />

      <p className="mb-4 text-sm text-ink/60">
        {template.items.length} items · {totalWeight} total weight
      </p>

      <div className="space-y-5">
        {[...byCategory.entries()].map(([category, items]) => (
          <Card key={category}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink/50">
              {category}
            </h2>
            <ul className="divide-y divide-gray-100">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <span className="text-sm text-ink">
                    {item.text}
                    {item.critical && (
                      <span className="ml-2 rounded bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-700">
                        Critical
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 text-xs text-ink/50">
                    weight {item.weight}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
