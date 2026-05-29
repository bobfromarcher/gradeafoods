import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, PageHeader, LinkButton, EmptyState } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";
import { startInspection } from "../../actions";

export default async function NewInspectionPage({
  searchParams,
}: {
  searchParams: Promise<{ facility?: string }>;
}) {
  const { facility: preselectedFacility } = await searchParams;
  const user = await requireUser();

  const [facilities, templates] = await Promise.all([
    prisma.facility.findMany({
      where: { organizationId: user.organizationId },
      orderBy: { name: "asc" },
    }),
    prisma.checklistTemplate.findMany({
      where: { organizationId: user.organizationId },
      orderBy: { name: "asc" },
    }),
  ]);

  if (facilities.length === 0 || templates.length === 0) {
    return (
      <div>
        <PageHeader title="New inspection" />
        <EmptyState
          title="A facility and a checklist are required"
          body="You need at least one facility and one checklist before you can run an inspection."
          action={
            <div className="flex gap-3">
              {facilities.length === 0 && (
                <LinkButton href="/facilities/new">Add facility</LinkButton>
              )}
              {templates.length === 0 && (
                <LinkButton href="/templates/new" variant="secondary">
                  New checklist
                </LinkButton>
              )}
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="New inspection"
        subtitle="Choose what you're inspecting and the checklist to grade against."
      />
      <Card className="max-w-xl">
        <form action={startInspection} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink/80">
              Facility
            </span>
            <select
              name="facilityId"
              defaultValue={preselectedFacility ?? facilities[0].id}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
            >
              {facilities.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink/80">
              Checklist
            </span>
            <select
              name="templateId"
              defaultValue={templates[0].id}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <SubmitButton>Start inspection</SubmitButton>
        </form>
      </Card>
    </div>
  );
}
