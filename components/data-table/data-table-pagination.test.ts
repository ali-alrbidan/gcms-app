import { describe, expect, it } from "vitest";
import { paginationPages } from "./data-table-pagination";

describe("data table pagination", () => {
  it("keeps short page ranges explicit", () => {
    expect(paginationPages(2, 4)).toEqual([1, 2, 3, 4]);
  });

  it("uses a compact ellipsis range for large result sets", () => {
    expect(paginationPages(8, 20)).toEqual([1, "ellipsis", 7, 8, 9, "ellipsis", 20]);
  });

  it("keeps the beginning and end useful", () => {
    expect(paginationPages(1, 20)).toEqual([1, 2, 3, 4, 5, "ellipsis", 20]);
    expect(paginationPages(20, 20)).toEqual([1, "ellipsis", 16, 17, 18, 19, 20]);
  });
});
