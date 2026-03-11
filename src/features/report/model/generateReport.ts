import { SUPPORTED_NETWORKS } from "src/config/networks";
import type {
  MonthlyReport,
  ReportProgress,
  SupportedNetwork,
  SupportedToken,
} from "src/domain/report";
import { fetchCoinGeckoPriceSamples } from "src/features/report/api/coingeckoClient";
import { fetchUsdPlnRates } from "src/features/report/api/nbpClient";
import { fetchIncomingTransfers } from "src/features/report/api/zksyncClient";
import { buildMonthlyReport } from "src/features/report/model/buildReport";
import { shiftIsoDate, formatWarsawDate, getWarsawMonthRange } from "src/lib/timezone";

interface GenerateMonthlyReportArgs {
  month: string;
  address: string;
  networkId: string;
  tokenAddress: string;
  onProgress?: (progress: ReportProgress) => void;
}

const TOTAL_PROGRESS_STEPS = 5;

function getSupportedPair(
  networkId: string,
  tokenAddress: string,
): { network: SupportedNetwork; token: SupportedToken } {
  const network = SUPPORTED_NETWORKS.find((candidate) => candidate.id === networkId);
  if (network === undefined) {
    throw new Error(`Unsupported network "${networkId}".`);
  }

  const token = network.tokens.find((candidate) => candidate.address === tokenAddress);
  if (token === undefined) {
    throw new Error(`Unsupported token "${tokenAddress}" for network ${networkId}.`);
  }

  return { network, token };
}

/**
 * Generates a monthly accountant report for a wallet address.
 *
 * @param args - Selected month, wallet address, and supported asset configuration.
 * @returns Monthly report rows and summary totals.
 */
export async function generateMonthlyReport(
  args: GenerateMonthlyReportArgs,
): Promise<MonthlyReport> {
  const { network, token } = getSupportedPair(args.networkId, args.tokenAddress);
  args.onProgress?.({
    currentStep: 1,
    label: "Preparing report range",
    totalSteps: TOTAL_PROGRESS_STEPS,
  });
  const monthRange = getWarsawMonthRange(args.month);
  args.onProgress?.({
    currentStep: 2,
    label: "Fetching zkSync Era transfers",
    totalSteps: TOTAL_PROGRESS_STEPS,
  });
  const transfers = await fetchIncomingTransfers({
    address: args.address,
    endEpochSeconds: monthRange.endEpochSeconds,
    rpcUrl: network.rpcUrl,
    startEpochSeconds: monthRange.startEpochSeconds,
    tokenAddress: token.address,
  });

  if (transfers.length === 0) {
    return {
      rows: [],
      summary: {
        resolvedCount: 0,
        totalPln: "0.00",
        totalUsd: "0.00",
        totalZk: "0.00",
        unresolvedCount: 0,
      },
    };
  }

  args.onProgress?.({
    currentStep: 3,
    label: "Fetching CoinGecko prices",
    totalSteps: TOTAL_PROGRESS_STEPS,
  });
  const priceSamples = await fetchCoinGeckoPriceSamples(
    token.coingeckoCoinId,
    monthRange.startEpochSeconds - 3600,
    monthRange.endEpochSeconds,
  );
  const nbpEndDate = formatWarsawDate(monthRange.endEpochSeconds - 1);
  const nbpStartDate = shiftIsoDate(formatWarsawDate(monthRange.startEpochSeconds), -14);
  args.onProgress?.({
    currentStep: 4,
    label: "Fetching NBP USD/PLN rates",
    totalSteps: TOTAL_PROGRESS_STEPS,
  });
  const fxRates = await fetchUsdPlnRates(nbpStartDate, nbpEndDate);
  args.onProgress?.({
    currentStep: 5,
    label: "Building accountant report",
    totalSteps: TOTAL_PROGRESS_STEPS,
  });

  return buildMonthlyReport({ fxRates, priceSamples, token, transfers });
}
