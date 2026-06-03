import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col bg-brand-50">
      <div className="mx-auto w-full max-w-md flex-1 px-6 py-10">
        <Link href="/" className="inline-block">
          <Logo className="text-lg text-ink" />
        </Link>
        <div className="mt-8 rounded-2xl border border-brand-100 bg-white p-8 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
