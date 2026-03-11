import { formatUnits } from "ethers";

import type { MonthlyReport, RawTransfer, ReportRow, SupportedToken } from "src/domain/report";
import type { FxRateSample } from "src/lib/fx";
import { selectLatestPriorRate } from "src/lib/fx";
import type { PriceSample } from "src/lib/pricing";
import { selectNearestPriceSample } from "src/lib/pricing";
import { calculateLineValues, summarizeResolvedRows } from "src/lib/reportMath";
import { formatWarsawDate } from "src/lib/timezone";

interface BuildMonthlyReportArgs {
  transfers: RawTransfer[];
  priceSamples: PriceSample[];
  fxRates: FxRateSample[];
  token: SupportedToken;
}

function buildResolvedRow(
  transfer: RawTransfer,
  amountZk: string,
  priceSample: PriceSample,
  fxRate: FxRateSample,
): ReportRow {
  const lineValues = calculateLineValues(amountZk, priceSample.priceUsd, fxRate.mid);

  return {
    amountZk,
    date: formatWarsawDate(transfer.timestampSeconds),
    fxEffectiveDate: fxRate.effectiveDate,
    notes: [],
    plnValue: lineValues.plnValue,
    txHash: transfer.txHash,
    usdPlnRate: fxRate.mid,
    usdRate: priceSample.priceUsd,
    usdValue: lineValues.usdValue,
  };
}

function buildUnresolvedRow(transfer: RawTransfer, amountZk: string, notes: string[]): ReportRow {
  return {
    amountZk,
    date: formatWarsawDate(transfer.timestampSeconds),
    fxEffectiveDate: null,
    notes,
    plnValue: null,
    txHash: transfer.txHash,
    usdPlnRate: null,
    usdRate: null,
    usdValue: null,
  };
}

/**
 * Builds accountant-ready report rows and summary totals from fetched transfer data.
 *
 * @param args - Transfers, price samples, FX rates, and supported token metadata.
 * @returns Monthly report rows and totals.
 */
export function buildMonthlyReport(args: BuildMonthlyReportArgs): MonthlyReport {
  const rows = args.transfers.map((transfer) => {
    const amountZk = formatUnits(transfer.amountAtomic, args.token.decimals);
    const reportDate = formatWarsawDate(transfer.timestampSeconds);
    const priceSample = selectNearestPriceSample(transfer.timestampSeconds, args.priceSamples);

    if (priceSample === null) {
      return buildUnresolvedRow(transfer, amountZk, [
        "Missing CoinGecko price sample near receipt time.",
      ]);
    }

    const fxRate = selectLatestPriorRate(reportDate, args.fxRates);
    if (fxRate === null) {
      return buildUnresolvedRow(transfer, amountZk, [
        "Missing NBP USD/PLN rate before the transaction date.",
      ]);
    }

    return buildResolvedRow(transfer, amountZk, priceSample, fxRate);
  });

  return {
    rows,
    summary: summarizeResolvedRows(rows),
  };
}
