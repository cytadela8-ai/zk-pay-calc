import BigNumber from "big.js";

import { fetchJson } from "src/lib/http";
import type { PriceSample } from "src/lib/pricing";

interface CoinGeckoRangeResponse {
  prices: [number, number][];
}

/**
 * Fetches historical USD price samples for a CoinGecko asset over a time range.
 *
 * @param coinId - CoinGecko asset identifier.
 * @param fromEpochSeconds - Inclusive range start in epoch seconds.
 * @param toEpochSeconds - Inclusive range end in epoch seconds.
 * @returns Price samples sorted by timestamp.
 */
export async function fetchCoinGeckoPriceSamples(
  coinId: string,
  fromEpochSeconds: number,
  toEpochSeconds: number,
): Promise<PriceSample[]> {
  const url = new URL(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range`);
  url.searchParams.set("vs_currency", "usd");
  url.searchParams.set("from", String(fromEpochSeconds));
  url.searchParams.set("to", String(toEpochSeconds));

  const response = await fetchJson<CoinGeckoRangeResponse>(url.toString());
  return response.prices.map(([timestampMilliseconds, priceUsd]) => ({
    priceUsd: new BigNumber(priceUsd.toString()).toString(),
    timestampSeconds: Math.floor(timestampMilliseconds / 1000),
  }));
}
