export interface PriceSample {
  timestampSeconds: number;
  priceUsd: string;
}

export function selectNearestPriceSample(
  timestampSeconds: number,
  samples: PriceSample[],
): PriceSample | null {
  if (samples.length === 0) {
    return null;
  }

  let nearestSample = samples[0];
  let nearestDistance = Math.abs(samples[0].timestampSeconds - timestampSeconds);

  for (const sample of samples.slice(1)) {
    const distance = Math.abs(sample.timestampSeconds - timestampSeconds);
    if (distance < nearestDistance) {
      nearestSample = sample;
      nearestDistance = distance;
    }
  }

  return nearestSample;
}
