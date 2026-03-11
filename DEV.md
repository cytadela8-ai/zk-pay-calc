# Development Notes

## Project structure

- `src/app/App.tsx`: top-level app entry page
- `src/app/router.tsx`: React Router configuration
- `src/config/networks.ts`: checked-in support config for zkSync Era and ZK
- `src/domain/report.ts`: core domain types for supported assets and monthly reports
- `src/features/report/api/coingeckoClient.ts`: CoinGecko historical USD sample fetcher
- `src/features/report/api/nbpClient.ts`: NBP USD/PLN archive fetcher
- `src/features/report/api/zksyncClient.ts`: zkSync Era transfer log reader via `ethers.js`
- `src/features/report/components/*.tsx`: report UI sections
- `src/features/report/hooks/useReportGenerator.ts`: UI state machine for report generation
- `src/features/report/model/buildReport.ts`: pure assembly of rows and totals from raw inputs
- `src/features/report/model/exportText.ts`: accountant-facing text formatter
- `src/features/report/model/generateReport.ts`: orchestration entry point combining chain, pricing, and FX fetches
- `src/lib/http.ts`: shared JSON fetch helper with contextual errors
- `src/lib/timezone.ts`: Warsaw month/date helpers
- `src/lib/pricing.ts`: nearest CoinGecko sample selection
- `src/lib/fx.ts`: prior-rate selection for NBP data
- `src/lib/reportMath.ts`: decimal math, amount formatting, and summary aggregation
- `src/styles/global.css`: editorial ledger visual treatment

## Architecture

The app stays fully client-side.

Report generation flow:

1. Convert the selected month into `Europe/Warsaw` start/end timestamps.
2. Query zkSync Era logs for incoming ZK `Transfer` events to the chosen address.
3. Fetch CoinGecko USD samples for the month window.
4. Fetch NBP USD/PLN archive data covering the month plus a short backward lookback.
5. Build accountant rows and summary totals with pure functions.
6. Persist the last wallet address in local storage for the next visit.
7. Render progress, the table, summary, and copyable export text.

## Key decisions

- No backend: CoinGecko replaced CoinMarketCap so the app can stay browser-only.
- Checked-in config instead of env vars: supported RPC and token metadata live in `src/config/networks.ts`.
- Warsaw timezone is the source of truth for month boundaries and displayed dates.
- NBP conversion uses the latest earlier publication date, never the same transaction date.
- `big.js` is used for decimal-safe currency math.
- The wallet address is persisted in browser local storage under `zk-pay-calc:last-wallet-address`.
- Report generation exposes staged progress updates from data fetching through final assembly.
- Heavy generation logic is lazy-loaded so the initial bundle stays below Vite's warning threshold.

## Testing

- Unit tests cover timezone conversion, pricing selection, NBP fallback logic, report math, report assembly, and export formatting.
- Component tests cover address validation, successful generation rendering, and the empty-state flow.
- Network boundaries are mocked in UI tests; pure report logic is tested directly.

## Supported assets

Current support is intentionally narrow:

- chain: zkSync Era (`chainId` 324)
- token: ZK (`0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E`)

To add more assets later, extend `src/config/networks.ts` and keep the UI selectors wired to that config.
