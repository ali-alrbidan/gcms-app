import { describe, expect, it } from "vitest";
import { resolveTheme } from "./theme-logic";

describe("theme resolution", () => {
  it("uses the system preference when nothing is saved", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme(null, false)).toBe("light");
  });
  it("keeps an explicit user choice over the system", () => {
    expect(resolveTheme("dark", false)).toBe("dark");
    expect(resolveTheme("light", true)).toBe("light");
  });
});
