# ZK Token To PLN Calculator Design

## Goal

Build a simple web app that generates an accountant-facing monthly report for incoming ZK token transfers on zkSync Era, including historical USD pricing near receipt time and USD/PLN conversion using the latest earlier NBP table A rate.

## Scope

- Simple web app using `yarn`, TypeScript, Node.js, React Router, a UI component library, and `ethers.js`
- Primary selectors: month and wallet address
- Secondary selectors: chain and token
- Current supported options only:
  - chain: zkSync Era
  - token: ZK
- Output per incoming transfer plus a monthly summary
- Month and displayed dates use the `Europe/Warsaw` timezone
- No backend; all data is fetched client-side

## External Data Sources

- zkSync Era RPC for on-chain transfer discovery
- CoinGecko for historical USD price near transfer time
- NBP archive table A for USD/PLN exchange rates

## Architecture

Use a pure client-side React application.

The app reads ZK `Transfer` events from zkSync Era through `ethers.js`, filters incoming transfers for the selected address and Warsaw-local month, then enriches each transfer with:

- nearest CoinGecko USD price sample around receipt time
- latest earlier USD/PLN rate from NBP table A

The UI renders:

- report filters
- loading/error/empty states
- per-transfer accountant table
- monthly summary totals
- copyable accountant export text

## UI Structure

- `AppShell`: page framing and visual style
- `ReportFilters`: month picker, address input, chain selector, token selector, submit action
- `ReportStatus`: loading, empty state, and error state
- `ReportTable`: one row per incoming transfer
- `ReportSummary`: monthly totals
- `ReportExport`: plain-text export block and copy action

## Visual Direction

Use an editorial ledger aesthetic:

- paper-toned light background
- distinct serif display typography
- monospace numeric typography
- subtle ruled-grid details
- strong summary card treatment

The interface should feel like a financial working paper, not a generic dashboard.

## Data Flow

1. User selects month and enters a wallet address.
2. App validates the address.
3. App resolves Warsaw-local month boundaries and converts them to timestamps.
4. App resolves the corresponding zkSync Era block range.
5. App queries ZK token `Transfer` logs where the selected address is the recipient.
6. For each transfer, app computes:
   - Warsaw-local transaction date
   - formatted token amount
   - nearest CoinGecko USD rate at receipt time
   - USD line value
   - latest earlier NBP USD/PLN rate
   - PLN line value
7. App renders detailed rows and a monthly summary.
8. App produces copyable accountant text.

## Calculation Rules

### Timezone

- Month filtering uses `Europe/Warsaw`
- Selected month start is `YYYY-MM-01 00:00:00` in `Europe/Warsaw`
- Selected month end is the first moment of the next month in `Europe/Warsaw`
- Displayed `Data` values use the Warsaw-local date in `YYYY-MM-DD`

### Transfer Filtering

- Report only incoming ZK transfers for the selected address
- Current support is limited to ZK on zkSync Era

### Pricing

- Use CoinGecko historical market chart range data
- Pick the nearest available USD price sample to the transfer timestamp

### FX Conversion

- Use NBP table A USD/PLN archive
- Choose the latest NBP publication before the transaction moment
- If there is no rate on the prior day or current day before receipt time, fall back to the most recent earlier business-day publication

### Rounding And Formatting

- `Ilość`: formatted token amount with grouping and token suffix
- `Kurs`: USD per ZK with 5 decimal places
- `W dolarach`: expression plus final USD result rounded to 2 decimals
- `Kurs USD/PLN`: 4 decimal places
- `W PLN`: rounded to 2 decimals
- Summary totals are calculated from precise internal values and rounded only for display

## Export Format

Each transfer line item includes:

- `Data`
- `Ilość`
- `Kurs`
- `W dolarach`
- `Kurs USD/PLN`
- `W PLN`

Example block:

```text
Data: 2026-01-18
Ilość: 30,556.94 ZK
Kurs: $0.03429/ZK
W dolarach: 30,556.94 * 0.03429 = $1047.80
Kurs USD/PLN: 4.0123
W PLN: 1047.80 * 4.0123 = 4204.12 PLN
```

The export also includes a monthly summary with total ZK, USD, and PLN.

## Configuration

Use a checked-in config module, not environment variables.

Initial config includes:

- official zkSync Era RPC URL
- zkSync Era metadata
- ZK token metadata and contract address

Chain and token selectors read from this config so the UI is ready for future expansion without adding extra infrastructure now.

## Error Handling

- Invalid wallet address: block generation with a clear validation error
- No transfers: show empty state, no export block
- Missing CoinGecko sample: mark row unresolved and exclude it from totals
- Missing NBP rate: walk backward automatically and show which publication date was used
- RPC/API failure: show retry affordance and preserve filters

## Testing Strategy

### Unit tests

- Warsaw month boundary conversion
- nearest CoinGecko sample selection
- NBP fallback selection for latest earlier rate
- amount, USD, and PLN calculations
- summary aggregation and rounding
- accountant export formatting

### Component tests

- valid report generation flow
- invalid address validation
- empty month state
- unresolved data warning state

Mock only HTTP and RPC boundaries. Keep report logic pure and directly testable.

## Documentation

Update:

- `README.md` with setup, run, and report usage instructions
- `DEV.md` with module layout, data flow, timezone rules, and external integrations

## Repository And Delivery

- initialize a local git repository
- commit the approved design doc
- create the GitHub repository using `gh`
- push the implementation to GitHub once complete
