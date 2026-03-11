export interface FxRateSample {
  effectiveDate: string;
  mid: string;
}

export function selectLatestPriorRate(
  transactionDate: string,
  rates: FxRateSample[],
): FxRateSample | null {
  let latestRate: FxRateSample | null = null;

  for (const rate of rates) {
    if (rate.effectiveDate >= transactionDate) {
      continue;
    }

    if (latestRate === null || rate.effectiveDate > latestRate.effectiveDate) {
      latestRate = rate;
    }
  }

  return latestRate;
}
