import type { SupportedNetwork } from "src/domain/report";

export const SUPPORTED_NETWORKS: SupportedNetwork[] = [
  {
    id: "zksync-era",
    name: "zkSync Era",
    chainId: 324,
    rpcUrl: "https://mainnet.era.zksync.io",
    tokens: [
      {
        address: "0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E",
        coingeckoCoinId: "zksync",
        decimals: 18,
        symbol: "ZK",
      },
    ],
  },
];
