import type { MonthlyReport, ReportRow } from "src/domain/report";
import { formatTokenAmount } from "src/lib/reportMath";

const amountFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 18,
  minimumFractionDigits: 0,
});

const usdFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  useGrouping: false,
});

function formatUsdValue(value: string): string {
  return `$${usdFormatter.format(Number(value))}`;
}

function formatPlnValue(value: string): string {
  return usdFormatter.format(Number(value));
}

function formatResolvedRow(row: ReportRow): string {
  if (
    row.usdRate === null ||
    row.usdValue === null ||
    row.usdPlnRate === null ||
    row.plnValue === null ||
    row.fxEffectiveDate === null
  ) {
    throw new Error(`Resolved row formatting failed for ${row.txHash}. Missing conversion data.`);
  }

  const amount = formatTokenAmount(row.amountZk, "ZK");
  const amountValue = amountFormatter.format(Number(row.amountZk));
  return [
    `Data: ${row.date}`,
    `Ilość: ${amount}`,
    `Kurs: $${row.usdRate}/ZK`,
    `W dolarach: ${amountValue} * ${row.usdRate} = ${formatUsdValue(row.usdValue)}`,
    `Kurs USD/PLN: ${row.usdPlnRate} (NBP ${row.fxEffectiveDate})`,
    `W PLN: ${row.usdValue} * ${row.usdPlnRate} = ${formatPlnValue(row.plnValue)} PLN`,
    `Hash: ${row.txHash}`,
  ].join("\n");
}

function formatUnresolvedRow(row: ReportRow): string {
  const amount = formatTokenAmount(row.amountZk, "ZK");
  const notes = row.notes.join(" ");

  return [`Data: ${row.date}`, `Ilość: ${amount}`, `Status: ${notes}`, `Hash: ${row.txHash}`].join(
    "\n",
  );
}

/**
 * Formats the monthly report into a copyable accountant-facing text block.
 *
 * @param monthlyReport - Resolved and unresolved report rows with summary totals.
 * @returns Multiline text for copying into accounting records.
 */
export function formatAccountantReport(monthlyReport: MonthlyReport): string {
  const rowBlocks = monthlyReport.rows.map((row) => {
    if (row.usdRate === null || row.usdValue === null || row.usdPlnRate === null) {
      return formatUnresolvedRow(row);
    }

    return formatResolvedRow(row);
  });
  const summaryBlock = [
    "Podsumowanie miesiąca",
    `Łącznie ZK: ${formatTokenAmount(monthlyReport.summary.totalZk, "ZK")}`,
    `Łącznie USD: ${formatUsdValue(monthlyReport.summary.totalUsd)}`,
    `Łącznie PLN: ${formatPlnValue(monthlyReport.summary.totalPln)} PLN`,
    `Pozycje rozliczone: ${monthlyReport.summary.resolvedCount}`,
    `Pozycje nierozliczone: ${monthlyReport.summary.unresolvedCount}`,
  ].join("\n");

  return [...rowBlocks, summaryBlock].join("\n\n");
}
