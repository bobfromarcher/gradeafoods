import { PageHeader } from "@/components/ui";
import { NewTemplateForm } from "./NewTemplateForm";

export default function NewTemplatePage() {
  return (
    <div>
      <PageHeader
        title="New checklist"
        subtitle="Define weighted criteria. Mark critical-control points that cap the grade at F if failed."
      />
      <NewTemplateForm />
    </div>
  );
}
