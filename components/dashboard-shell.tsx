// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useAuth } from "@/lib/auth-context";
// import { useState } from "react";
// import { Loader2 } from "lucide-react";

// export interface NavItem {
//   label: string;
//   href: string;
// }

// export function DashboardShell({
//   navItems,
//   sectionLabel,
//   children,
// }: {
//   navItems: NavItem[];
//   sectionLabel: string;
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const { user, logout } = useAuth();
//   const router = useRouter();
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   async function onLogout() {
//     setIsLoggingOut(true);
//     try {
//       await logout();
//       router.push("/login");
//     } catch (error) {
//       console.error("Logout failed:", error);
//       setIsLoggingOut(false);
//     }
//   }

//   return (
//     <div className="flex min-h-screen">
//       <aside className="flex w-60 shrink-0 flex-col justify-between bg-ink text-white h-screen sticky top-0 overflow-y-auto">
//         <div>
//           <div className="border-b border-white/10 px-5 py-5">
//             <p className="text-xs uppercase tracking-[0.2em] text-brass">
//               GCMS
//             </p>
//             <p className="mt-1 text-sm font-medium">{sectionLabel}</p>
//           </div>
//           <nav className="px-3 py-4">
//             {navItems.map((item) => {
//               const active = pathname === item.href;
//               return (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   className={`mb-1 block rounded-md px-3 py-2 text-sm transition ${
//                     active
//                       ? "bg-brass/20 text-white font-medium"
//                       : "text-white/70 hover:bg-white/5 hover:text-white"
//                   }`}
//                 >
//                   {item.label}
//                 </Link>
//               );
//             })}
//           </nav>
//         </div>

//         <div className="border-t border-white/10 px-5 py-4">
//           <p className="truncate text-sm font-medium">{user?.name}</p>
//           <p className="truncate text-xs text-white/50">{user?.email}</p>
//           <button
//             onClick={onLogout}
//             disabled={isLoggingOut}
//             className="mt-3 w-full rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/5 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//           >
//             {isLoggingOut ? (
//               <>
//                 <Loader2 className="h-3.5 w-3.5 animate-spin" />
//                 Signing out...
//               </>
//             ) : (
//               "Sign out"
//             )}
//           </button>
//         </div>
//       </aside>

//       <main className="flex-1 bg-paper overflow-y-auto h-screen">
//         <div className="px-8 py-8">{children}</div>
//       </main>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/locale-context";
import { LanguageSwitch } from "@/components/language-switch";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export interface NavItem {
  labelKey: string;
  href: string;
}

export function DashboardShell({
  navItems,
  sectionLabelKey,
  children,
}: {
  navItems: NavItem[];
  sectionLabelKey: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const { t } = useLocale();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  async function onLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 shrink-0 flex-col justify-between bg-ink text-white h-screen sticky top-0 overflow-y-auto">
        <div>
          <div className="border-b border-white/10 px-5 py-5">
            <img src="/logo-white.png" alt="Balagh Logo" className="h-10 w-auto mb-3" />
            <p className="text-xs uppercase tracking-[0.2em] text-brass">
              GCMS
            </p>
            <p className="mt-1 text-sm font-medium">{t(sectionLabelKey)}</p>
            <div className="mt-3">
              <LanguageSwitch dark />
            </div>
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
                  {t(item.labelKey)}
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
            disabled={isLoggingOut}
            className="mt-3 w-full rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/5 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Signing out...
              </>
            ) : (
              t("common.signOut")
            )}
          </button>
        </div>
      </aside>
      <main className="flex-1 bg-paper overflow-y-auto h-screen">
        <div className="px-8 py-8">{children}</div>
      </main>{" "}
    </div>
  );
}
