"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export interface NavItem {
  label: string;
  href: string;
}

export function DashboardShell({
  navItems,
  sectionLabel,
  children,
}: {
  navItems: NavItem[];
  sectionLabel: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  async function onLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 shrink-0 flex-col justify-between bg-ink text-white">
        <div>
          <div className="border-b border-white/10 px-5 py-5">
            <p className="text-xs uppercase tracking-[0.2em] text-brass">GCMS</p>
            <p className="mt-1 text-sm font-medium">{sectionLabel}</p>
          </div>
          <nav className="px-3 py-4">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mb-1 block rounded-md px-3 py-2 text-sm transition ${
                    active
                      ? "bg-brass/20 text-white font-medium"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-white/10 px-5 py-4">
          <p className="truncate text-sm font-medium">{user?.name}</p>
          <p className="truncate text-xs text-white/50">{user?.email}</p>
          <button
            onClick={onLogout}
            className="mt-3 w-full rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-paper px-8 py-8">{children}</main>
    </div>
  );
}
