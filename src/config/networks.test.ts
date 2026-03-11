import { describe, expect, it } from "vitest";

import { SUPPORTED_NETWORKS } from "src/config/networks";

describe("SUPPORTED_NETWORKS", () => {
  it("only exposes zkSync Era with the official RPC and ZK token", () => {
    expect(SUPPORTED_NETWORKS).toHaveLength(1);

    const [network] = SUPPORTED_NETWORKS;
    expect(network.id).toBe("zksync-era");
    expect(network.chainId).toBe(324);
    expect(network.rpcUrl).toBe("https://mainnet.era.zksync.io");
    expect(network.tokens).toHaveLength(1);

    expect(network.tokens[0]).toEqual({
      address: "0x5A7d6b2F92C77FAD6CCAbd7Ee0624E64907eaF3E",
      coingeckoCoinId: "zksync",
      decimals: 18,
      symbol: "ZK",
    });
  });
});
