"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

const cards = [
  { label: "Departments", href: "/admin/departments", blurb: "Manage the departments complaints route to." },
  { label: "Categories", href: "/admin/categories", blurb: "Manage complaint categories per department." },
  { label: "Priorities", href: "/admin/priorities", blurb: "Manage priority levels and colors." },
  { label: "SLA rules", href: "/admin/sla-rules", blurb: "Set response and resolution time targets." },
];

export default function AdminOverviewPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Welcome, {user?.name?.split(" ")[0]}</h1>
      <p className="mt-1 text-sm text-muted">Here&apos;s what you can manage from here.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-lg border border-line bg-surface p-5 shadow-sm transition hover:border-brass"
          >
            <p className="font-medium text-ink">{card.label}</p>
            <p className="mt-1 text-sm text-muted">{card.blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
