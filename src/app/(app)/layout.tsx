import { requireUser } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="flex min-h-full">
      <Sidebar userName={user.name} orgName={user.organizationName} />
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto w-full max-w-5xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
