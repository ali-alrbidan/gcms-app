function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

const RATE_KEY_HINTS = ["rate", "percentage"];
const MINUTES_KEY_HINTS = ["minutes"];

/** Pulls a human label out of a nested object like {id, name, code, level} */
function nestedLabel(obj: Record<string, unknown>): string {
  if (typeof obj.name === "string") return obj.name;
  if (typeof obj.code === "string") return obj.code;
  if (typeof obj.id !== "undefined") return String(obj.id);
  return JSON.stringify(obj);
}

function formatCell(key: string, value: unknown): string {
  if (value === null || value === undefined) return "—";

  if (isPlainObject(value)) return nestedLabel(value);

  if (typeof value === "number") {
    const lowerKey = key.toLowerCase();
    if (RATE_KEY_HINTS.some((h) => lowerKey.includes(h))) {
      const pct = value <= 1 ? value * 100 : value;
      return `${Math.round(pct * 100) / 100}%`;
    }
    if (MINUTES_KEY_HINTS.some((h) => lowerKey.includes(h))) {
      return `${value.toLocaleString("ar")} د`;
    }
    return value.toLocaleString("ar");
  }

  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function humanizeKey(key: string): string {
  const map: Record<string, string> = {
    department: "القسم",
    category: "التصنيف",
    priority: "الأولوية",
    employee: "الموظف",
    status: "الحالة",
    total: "الإجمالي",
    open: "مفتوحة",
    resolved: "محلولة",
    closed: "مغلقة",
    count: "العدد",
    percentage: "النسبة",
    sla_breached: "تجاوزت SLA",
    sla_breach_rate: "نسبة تجاوز SLA",
    average_resolution_minutes: "متوسط وقت الحل",
    total_with_sla: "الإجمالي (له SLA)",
    breached: "تجاوزت",
    breach_rate: "نسبة التجاوز",
    assigned_total: "إجمالي المسندة",
    in_progress: "قيد التنفيذ",
    average_first_response_minutes: "متوسط وقت أول رد",
    resolution_rate: "نسبة الحل",
    sla_success_rate: "نسبة الالتزام بـ SLA",
  };
  return map[key] ?? key.replace(/_/g, " ");
}

export function AutoTable({ rows }: { rows: unknown }) {
  const list: unknown[] = Array.isArray(rows)
    ? rows
    : isPlainObject(rows)
      ? Object.entries(rows).map(([key, value]) => ({ key, value }))
      : [];

  if (list.length === 0) {
    return <p className="p-4 text-sm text-muted">لا توجد بيانات.</p>;
  }

  const columns = isPlainObject(list[0]) ? Object.keys(list[0]) : ["القيمة"];

  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
        <tr>
          {columns.map((col) => (
            <th key={col} className="px-4 py-2 font-medium">
              {humanizeKey(col)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {list.map((row, i) => (
          <tr key={i} className="border-b border-line last:border-0">
            {isPlainObject(row) ? (
              columns.map((col) => (
                <td key={col} className="px-4 py-2 text-ink">
                  {formatCell(col, row[col])}
                </td>
              ))
            ) : (
              <td className="px-4 py-2 text-ink">{formatCell("", row)}</td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** A small horizontal row of stat cards for flat scalar objects (e.g. SLA performance summary). */
export function StatRow({ data }: { data: Record<string, unknown> }) {
  const scalarEntries = Object.entries(data).filter(
    ([, v]) => !isPlainObject(v) && !Array.isArray(v),
  );
  if (scalarEntries.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-3 border-b border-line p-4 sm:grid-cols-4">
      {scalarEntries.map(([key, value]) => (
        <div key={key}>
          <p className="text-xs uppercase tracking-wide text-muted">
            {humanizeKey(key)}
          </p>
          <p className="mt-1 text-lg font-semibold text-ink">
            {formatCell(key, value)}
          </p>
        </div>
      ))}
    </div>
  );
}
