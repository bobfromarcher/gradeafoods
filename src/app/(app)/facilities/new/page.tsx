import { PageHeader, Card } from "@/components/ui";
import { NewFacilityForm } from "./NewFacilityForm";

export default function NewFacilityPage() {
  return (
    <div>
      <PageHeader title="Add facility" subtitle="Register a new site to inspect." />
      <Card className="max-w-xl">
        <NewFacilityForm />
      </Card>
    </div>
  );
}
