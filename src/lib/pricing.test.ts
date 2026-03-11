import { describe, expect, it } from "vitest";

import { selectNearestPriceSample } from "src/lib/pricing";

describe("selectNearestPriceSample", () => {
  it("picks the closest CoinGecko sample to the transfer timestamp", () => {
    expect(
      selectNearestPriceSample(1_700_000_000, [
        { priceUsd: "0.03000", timestampSeconds: 1_699_999_700 },
        { priceUsd: "0.03100", timestampSeconds: 1_700_000_120 },
        { priceUsd: "0.02900", timestampSeconds: 1_700_000_500 },
      ]),
    ).toEqual({
      priceUsd: "0.03100",
      timestampSeconds: 1_700_000_120,
    });
  });

  it("returns null when CoinGecko does not return any samples", () => {
    expect(selectNearestPriceSample(1_700_000_000, [])).toBeNull();
  });
});
