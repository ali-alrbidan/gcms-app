import { describe, expect, it } from "vitest";
import { pageAfterDelete } from "./pagination-logic";

const meta = (current_page: number, last_page: number) => ({ current_page, last_page, per_page: 10, from: 21, to: 21, total: 21 });

describe("shared list pagination behavior", () => {
  it("uses the backend page and per-page values without client slicing", () => {
    expect(meta(2, 4)).toMatchObject({ current_page: 2, per_page: 10 });
  });

  it("moves back after deleting the final row of the final page", () => {
    expect(pageAfterDelete(meta(3, 3), 1)).toBe(2);
    expect(pageAfterDelete(meta(2, 3), 1)).toBeNull();
    expect(pageAfterDelete(meta(3, 3), 2)).toBeNull();
  });
});
