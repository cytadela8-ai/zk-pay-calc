import { ethers } from "ethers";

import type { RawTransfer } from "src/domain/report";

const transferEventSignature = "Transfer(address,address,uint256)";
const transferTopic = ethers.id(transferEventSignature);
const transferInterface = new ethers.Interface([
  "event Transfer(address indexed from, address indexed to, uint256 value)",
]);

interface FetchIncomingTransfersArgs {
  address: string;
  rpcUrl: string;
  tokenAddress: string;
  startEpochSeconds: number;
  endEpochSeconds: number;
}

interface TransferLogLike {
  data: string;
  topics: string[];
}

interface DecodedTransferLog {
  amountAtomic: string;
  from: string;
  to: string;
}

async function getRequiredBlock(
  provider: ethers.JsonRpcProvider,
  blockNumber: number,
): Promise<ethers.Block> {
  const block = await provider.getBlock(blockNumber);
  if (block === null) {
    throw new Error(`Block ${blockNumber} was not returned by the RPC provider.`);
  }

  return block;
}

async function findBlockAtOrAfter(
  provider: ethers.JsonRpcProvider,
  targetEpochSeconds: number,
  latestBlockNumber: number,
): Promise<number> {
  let low = 0;
  let high = latestBlockNumber;

  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    const block = await getRequiredBlock(provider, middle);

    if (block.timestamp < targetEpochSeconds) {
      low = middle + 1;
      continue;
    }

    high = middle;
  }

  return low;
}

async function findBlockAtOrBefore(
  provider: ethers.JsonRpcProvider,
  targetEpochSeconds: number,
  latestBlockNumber: number,
): Promise<number> {
  let low = 0;
  let high = latestBlockNumber;

  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    const block = await getRequiredBlock(provider, middle);

    if (block.timestamp > targetEpochSeconds) {
      high = middle - 1;
      continue;
    }

    low = middle;
  }

  return low;
}

/**
 * Decodes a standard ERC-20 transfer log.
 *
 * @param log - Log data and topics from the RPC provider.
 * @returns Decoded sender, recipient, and raw token amount.
 */
export function decodeTransferLog(log: TransferLogLike): DecodedTransferLog {
  const parsedLog = transferInterface.parseLog(log);

  return {
    amountAtomic: parsedLog.args.value.toString(),
    from: parsedLog.args.from,
    to: parsedLog.args.to,
  };
}

/**
 * Fetches incoming ERC-20 transfers for an address over a timestamp interval.
 *
 * @param args - RPC, token, address, and time range details.
 * @returns Incoming transfers sorted by timestamp.
 */
export async function fetchIncomingTransfers(
  args: FetchIncomingTransfersArgs,
): Promise<RawTransfer[]> {
  const provider = new ethers.JsonRpcProvider(args.rpcUrl);
  const normalizedAddress = ethers.getAddress(args.address);
  const latestBlockNumber = await provider.getBlockNumber();
  const fromBlock = await findBlockAtOrAfter(provider, args.startEpochSeconds, latestBlockNumber);
  const toBlock = await findBlockAtOrBefore(provider, args.endEpochSeconds - 1, latestBlockNumber);

  if (fromBlock > toBlock) {
    return [];
  }

  const logs = await provider.getLogs({
    address: args.tokenAddress,
    fromBlock,
    toBlock,
    topics: [transferTopic, null, ethers.zeroPadValue(normalizedAddress, 32)],
  });
  const blockCache = new Map<number, Promise<ethers.Block>>();

  const transfers = await Promise.all(
    logs.map(async (log) => {
      const cachedBlock = blockCache.get(log.blockNumber);
      const blockPromise = cachedBlock ?? getRequiredBlock(provider, log.blockNumber);
      blockCache.set(log.blockNumber, blockPromise);
      const block = await blockPromise;
      const decodedLog = decodeTransferLog(log);

      return {
        amountAtomic: decodedLog.amountAtomic,
        blockNumber: log.blockNumber,
        timestampSeconds: block.timestamp,
        txHash: log.transactionHash,
      } satisfies RawTransfer;
    }),
  );

  return transfers.sort((left, right) => left.timestampSeconds - right.timestampSeconds);
}
