import { describe, expect, it } from "vitest";

import { formatWarsawDate, getWarsawMonthRange } from "src/lib/timezone";

describe("getWarsawMonthRange", () => {
  it("returns UTC timestamps that match Warsaw month boundaries in winter time", () => {
    expect(getWarsawMonthRange("2026-01")).toEqual({
      endEpochSeconds: 1769900400,
      startEpochSeconds: 1767222000,
    });
  });

  it("returns UTC timestamps that match Warsaw month boundaries across dst months", () => {
    expect(getWarsawMonthRange("2026-04")).toEqual({
      endEpochSeconds: 1777586400,
      startEpochSeconds: 1774994400,
    });
  });
});

describe("formatWarsawDate", () => {
  it("formats the transaction date in Europe/Warsaw", () => {
    expect(formatWarsawDate(1768779000)).toBe("2026-01-19");
    expect(formatWarsawDate(1781821800)).toBe("2026-06-19");
  });
});
