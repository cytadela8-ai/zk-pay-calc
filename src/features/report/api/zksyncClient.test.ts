import { ethers } from "ethers";
import { describe, expect, it } from "vitest";

import { decodeTransferLog } from "src/features/report/api/zksyncClient";

describe("decodeTransferLog", () => {
  it("decodes a standard ERC-20 Transfer log without overrunning the data buffer", () => {
    const from = "0x1111111111111111111111111111111111111111";
    const to = "0x2222222222222222222222222222222222222222";
    const amountAtomic = 30556940000000000000000n;

    expect(
      decodeTransferLog({
        blockNumber: 12,
        data: ethers.AbiCoder.defaultAbiCoder().encode(["uint256"], [amountAtomic]),
        topics: [
          ethers.id("Transfer(address,address,uint256)"),
          ethers.zeroPadValue(from, 32),
          ethers.zeroPadValue(to, 32),
        ],
        transactionHash: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      }),
    ).toEqual({
      amountAtomic: amountAtomic.toString(),
      from,
      to,
    });
  });
});
