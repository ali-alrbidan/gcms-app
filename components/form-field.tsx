export function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brass focus:ring-1 focus:ring-brass";

export const primaryButtonClass =
  "rounded-md bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-ink-2 disabled:opacity-50";

export const secondaryButtonClass =
  "rounded-md border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-paper";

export const dangerButtonClass =
  "rounded-md border border-brick/30 px-3 py-1.5 text-xs font-medium text-brick transition hover:bg-brick/10";
