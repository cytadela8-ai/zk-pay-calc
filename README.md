# ZK to PLN Calculator

Simple React web app that generates an accountant-facing monthly report for incoming ZK token transfers on zkSync Era.

The report:

- filters by `Europe/Warsaw` month
- reads incoming ZK transfers directly from zkSync Era with `ethers.js`
- prices each receipt in USD using CoinGecko samples near the transfer time
- converts USD to PLN using the latest earlier NBP table A USD rate
- produces per-transfer rows plus a monthly summary
- provides a copyable plain-text export for accounting records

## Stack

- Node.js 22
- Yarn
- TypeScript
- React + React Router
- Radix Themes
- ethers.js
- Vitest + Testing Library

## Requirements

- Node.js 22+
- Yarn 1.22+

## Development

```bash
yarn install
yarn dev
```

Open the local Vite URL shown in the terminal.

## Verification

```bash
yarn lint
yarn typecheck
yarn test:run
yarn build
```

## Usage

1. Choose a month.
2. Enter the receiving wallet address.
3. Review the fixed selectors for `zkSync Era` and `ZK`.
4. Click `Generate report`.
5. Copy the export block for your accountant.

## Data sources

- zkSync Era official RPC: `https://mainnet.era.zksync.io`
- CoinGecko market chart range API for ZK/USD history
- NBP archive API for USD/PLN rates

## Notes

- Only incoming ZK transfers are included.
- Month boundaries and displayed transaction dates use `Europe/Warsaw`.
- USD/PLN uses the latest NBP publication before the transaction date.
- Supported chain and token are currently hardcoded in the app config.
