import { describe, expect, it } from "vitest";

import { calculateLineValues, formatTokenAmount, summarizeResolvedRows } from "src/lib/reportMath";

describe("calculateLineValues", () => {
  it("calculates usd and pln values with precise decimal math", () => {
    expect(calculateLineValues("30556.94", "0.03429", "4.0123")).toEqual({
      plnValue: "4204.08",
      usdValue: "1047.80",
    });
  });
});

describe("formatTokenAmount", () => {
  it("formats grouped token amounts with the token symbol", () => {
    expect(formatTokenAmount("30556.94", "ZK")).toBe("30,556.94 ZK");
  });
});

describe("summarizeResolvedRows", () => {
  it("aggregates precise totals and tracks unresolved rows", () => {
    expect(
      summarizeResolvedRows([
        { amountZk: "1.10", plnValue: "8.00", usdValue: "2.00" },
        { amountZk: "2.20", plnValue: null, usdValue: null },
        { amountZk: "3.30", plnValue: "12.00", usdValue: "3.00" },
      ]),
    ).toEqual({
      resolvedCount: 2,
      totalPln: "20.00",
      totalUsd: "5.00",
      totalZk: "6.60",
      unresolvedCount: 1,
    });
  });
});
