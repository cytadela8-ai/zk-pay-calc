import { describe, expect, it } from "vitest";

import type { MonthlyReport } from "src/domain/report";
import { formatAccountantReport } from "src/features/report/model/exportText";

const monthlyReport: MonthlyReport = {
  rows: [
    {
      amountZk: "30556.94",
      date: "2026-01-19",
      fxEffectiveDate: "2026-01-16",
      notes: [],
      plnValue: "4204.08",
      txHash: "0xaaa",
      usdPlnRate: "4.0123",
      usdRate: "0.03429",
      usdValue: "1047.80",
    },
  ],
  summary: {
    resolvedCount: 1,
    totalPln: "4204.08",
    totalUsd: "1047.80",
    totalZk: "30556.94",
    unresolvedCount: 0,
  },
};

describe("formatAccountantReport", () => {
  it("formats the accountant text block with line items and a monthly summary", () => {
    expect(formatAccountantReport(monthlyReport)).toBe(`Data: 2026-01-19
Ilość: 30,556.94 ZK
Kurs: $0.03429/ZK
W dolarach: 30,556.94 * 0.03429 = $1047.80
Kurs USD/PLN: 4.0123 (NBP 2026-01-16)
W PLN: 1047.80 * 4.0123 = 4204.08 PLN
Hash: 0xaaa

Podsumowanie miesiąca
Łącznie ZK: 30,556.94 ZK
Łącznie USD: $1047.80
Łącznie PLN: 4204.08 PLN
Pozycje rozliczone: 1
Pozycje nierozliczone: 0`);
  });
});
