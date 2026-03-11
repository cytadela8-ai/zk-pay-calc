export interface SupportedToken {
  address: `0x${string}`;
  symbol: string;
  decimals: number;
  coingeckoCoinId: string;
}

export interface SupportedNetwork {
  id: string;
  name: string;
  chainId: number;
  rpcUrl: string;
  tokens: SupportedToken[];
}

export interface RawTransfer {
  txHash: string;
  blockNumber: number;
  timestampSeconds: number;
  amountAtomic: string;
}

export interface ReportRow {
  txHash: string;
  date: string;
  amountZk: string;
  fxEffectiveDate: string | null;
  usdRate: string | null;
  usdValue: string | null;
  usdPlnRate: string | null;
  plnValue: string | null;
  notes: string[];
}

export interface ReportSummary {
  totalZk: string;
  totalUsd: string;
  totalPln: string;
  resolvedCount: number;
  unresolvedCount: number;
}

export interface MonthlyReport {
  rows: ReportRow[];
  summary: ReportSummary;
}
