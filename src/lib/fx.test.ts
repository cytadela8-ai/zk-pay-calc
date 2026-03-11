import { describe, expect, it } from "vitest";

import { selectLatestPriorRate } from "src/lib/fx";

describe("selectLatestPriorRate", () => {
  it("picks the latest NBP publication before the transaction date", () => {
    expect(
      selectLatestPriorRate("2026-01-18", [
        { effectiveDate: "2026-01-14", mid: "4.0800" },
        { effectiveDate: "2026-01-16", mid: "4.0123" },
        { effectiveDate: "2026-01-18", mid: "4.0999" },
      ]),
    ).toEqual({
      effectiveDate: "2026-01-16",
      mid: "4.0123",
    });
  });

  it("returns null when there is no earlier rate available", () => {
    expect(
      selectLatestPriorRate("2026-01-01", [{ effectiveDate: "2026-01-01", mid: "4.0123" }]),
    ).toBeNull();
  });
});
