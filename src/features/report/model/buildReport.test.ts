import { describe, expect, it } from "vitest";

import type { RawTransfer, SupportedToken } from "src/domain/report";
import { buildMonthlyReport } from "src/features/report/model/buildReport";
import type { FxRateSample } from "src/lib/fx";
import type { PriceSample } from "src/lib/pricing";

const zkToken: SupportedToken = {
  address: "0x5A7d6b2F92C77FAD6CCAbd7Ee0624E64907eaF3E",
  coingeckoCoinId: "zksync",
  decimals: 18,
  symbol: "ZK",
};

const transfers: RawTransfer[] = [
  {
    amountAtomic: "30556940000000000000000",
    blockNumber: 1,
    timestampSeconds: 1768779000,
    txHash: "0xaaa",
  },
];

const priceSamples: PriceSample[] = [
  {
    priceUsd: "0.03429",
    timestampSeconds: 1768778940,
  },
];

const fxRates: FxRateSample[] = [
  {
    effectiveDate: "2026-01-16",
    mid: "4.0123",
  },
  {
    effectiveDate: "2026-01-19",
    mid: "4.1000",
  },
];

describe("buildMonthlyReport", () => {
  it("builds report rows and a summary using Warsaw dates and prior FX rates", () => {
    expect(buildMonthlyReport({ fxRates, priceSamples, token: zkToken, transfers })).toEqual({
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
    });
  });

  it("marks a row unresolved when CoinGecko prices are missing", () => {
    expect(buildMonthlyReport({ fxRates, priceSamples: [], token: zkToken, transfers })).toEqual({
      rows: [
        {
          amountZk: "30556.94",
          date: "2026-01-19",
          fxEffectiveDate: null,
          notes: ["Missing CoinGecko price sample near receipt time."],
          plnValue: null,
          txHash: "0xaaa",
          usdPlnRate: null,
          usdRate: null,
          usdValue: null,
        },
      ],
      summary: {
        resolvedCount: 0,
        totalPln: "0.00",
        totalUsd: "0.00",
        totalZk: "30556.94",
        unresolvedCount: 1,
      },
    });
  });
});
