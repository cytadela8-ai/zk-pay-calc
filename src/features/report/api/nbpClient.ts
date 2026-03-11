import { fetchJson } from "src/lib/http";
import type { FxRateSample } from "src/lib/fx";

interface NbpRateResponse {
  rates: Array<{
    effectiveDate: string;
    mid: number;
  }>;
}

/**
 * Fetches historical USD/PLN rates from the NBP table A archive.
 *
 * @param startDate - Inclusive range start in YYYY-MM-DD.
 * @param endDate - Inclusive range end in YYYY-MM-DD.
 * @returns Historical rate samples sorted by effective date.
 */
export async function fetchUsdPlnRates(
  startDate: string,
  endDate: string,
): Promise<FxRateSample[]> {
  const url = `https://api.nbp.pl/api/exchangerates/rates/a/usd/${startDate}/${endDate}/?format=json`;
  const response = await fetchJson<NbpRateResponse>(url);

  return response.rates.map((rate) => ({
    effectiveDate: rate.effectiveDate,
    mid: rate.mid.toString(),
  }));
}
