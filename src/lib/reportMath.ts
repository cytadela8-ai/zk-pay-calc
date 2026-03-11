import BigNumber from "big.js";

import type { ReportSummary } from "src/domain/report";

interface ResolvedRowForSummary {
  amountZk: string;
  usdValue: string | null;
  plnValue: string | null;
}

interface LineValues {
  usdValue: string;
  plnValue: string;
}

const tokenAmountFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 18,
  minimumFractionDigits: 0,
});

export function calculateLineValues(
  amountZk: string,
  usdRate: string,
  usdPlnRate: string,
): LineValues {
  const amount = new BigNumber(amountZk);
  const usdValue = amount.times(usdRate);
  const plnValue = usdValue.times(usdPlnRate);

  return {
    plnValue: plnValue.round(2, BigNumber.roundHalfUp).toFixed(2),
    usdValue: usdValue.round(2, BigNumber.roundHalfUp).toFixed(2),
  };
}

export function formatTokenAmount(amount: string, symbol: string): string {
  return `${tokenAmountFormatter.format(Number(amount))} ${symbol}`;
}

export function summarizeResolvedRows(rows: ResolvedRowForSummary[]): ReportSummary {
  let totalZk = new BigNumber(0);
  let totalUsd = new BigNumber(0);
  let totalPln = new BigNumber(0);
  let resolvedCount = 0;
  let unresolvedCount = 0;

  for (const row of rows) {
    totalZk = totalZk.plus(row.amountZk);

    if (row.usdValue === null || row.plnValue === null) {
      unresolvedCount += 1;
      continue;
    }

    totalUsd = totalUsd.plus(row.usdValue);
    totalPln = totalPln.plus(row.plnValue);
    resolvedCount += 1;
  }

  return {
    resolvedCount,
    totalPln: totalPln.round(2, BigNumber.roundHalfUp).toFixed(2),
    totalUsd: totalUsd.round(2, BigNumber.roundHalfUp).toFixed(2),
    totalZk: totalZk.round(18, BigNumber.roundHalfUp).toFixed(2),
    unresolvedCount,
  };
}
