export type Theme = "light" | "dark";
export function resolveTheme(saved: string | null, prefersDark: boolean): Theme { return saved === "dark" || saved === "light" ? saved : prefersDark ? "dark" : "light"; }
