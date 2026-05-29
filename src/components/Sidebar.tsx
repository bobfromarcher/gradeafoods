"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { logoutAction } from "@/app/(auth)/actions";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/inspections", label: "Inspections" },
  { href: "/facilities", label: "Facilities" },
  { href: "/templates", label: "Checklists" },
];

export function Sidebar({
  userName,
  orgName,
}: {
  userName: string;
  orgName: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-5 py-5">
        <Link href="/dashboard">
          <Logo className="text-base text-ink" />
        </Link>
        <p className="mt-2 truncate text-xs text-ink/50">{orgName}</p>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-ink/70 hover:bg-gray-50 hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-100 px-3 py-4">
        <div className="px-2 pb-2">
          <p className="truncate text-sm font-medium text-ink">{userName}</p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-ink/60 transition hover:bg-gray-50 hover:text-ink"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
