# ZK Token To PLN Calculator Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a client-side React web app that generates Warsaw-time monthly accountant reports for incoming ZK transfers on zkSync Era with CoinGecko USD pricing and NBP USD/PLN conversion.

**Architecture:** Use a Vite-based React + TypeScript app with React Router for routing, Radix Themes for UI primitives, and `ethers` for chain reads. Keep all report logic in pure utility modules so timezone handling, CoinGecko sample selection, NBP fallback logic, and export formatting can be verified with unit tests before wiring the UI.

**Tech Stack:** Node 22, Yarn, React 19, TypeScript 5, Vite 7, React Router 7, Radix Themes, ethers 6, Vitest, Testing Library, oxlint.

---

### Task 1: Scaffold the project and baseline tooling

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/app/router.tsx`
- Create: `src/app/App.tsx`
- Create: `src/styles/global.css`
- Create: `src/test/setup.ts`

**Step 1: Create project manifest and scripts**
- Add exact dependency versions for React, React Router, Radix Themes, ethers, and test tooling.
- Add scripts for `dev`, `build`, `test`, `test:run`, `typecheck`, `lint`.

**Step 2: Configure strict TypeScript and Vite**
- Enable strict compiler options, including:
  - `strict`
  - `noUncheckedIndexedAccess`
  - `exactOptionalPropertyTypes`
  - `noImplicitOverride`
  - `noPropertyAccessFromIndexSignature`
  - `verbatimModuleSyntax`
  - `isolatedModules`

**Step 3: Add minimal app shell and router**
- Create a single routed page for the report generator.
- Wire test setup for jsdom and Testing Library.

**Step 4: Run install and baseline verification**
Run: `yarn install`
Run: `yarn typecheck`
Run: `yarn test:run`
Expected: baseline project compiles and empty test suite passes.

**Step 5: Commit**
```bash
git add .
git commit -m "Scaffold ZK PLN calculator app"
```

### Task 2: Add checked-in support config and domain types

**Files:**
- Create: `src/config/networks.ts`
- Create: `src/domain/report.ts`
- Test: `src/config/networks.test.ts`

**Step 1: Write the failing test**
- Verify the support config exposes exactly one network and one token.
- Verify the config contains the official zkSync Era RPC URL and ZK metadata.

**Step 2: Run test to verify it fails**
Run: `yarn vitest run src/config/networks.test.ts`
Expected: FAIL because config module does not exist.

**Step 3: Write minimal implementation**
- Create typed config and domain models for report rows, summary totals, and supported assets.

**Step 4: Run test to verify it passes**
Run: `yarn vitest run src/config/networks.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add src/config/networks.ts src/domain/report.ts src/config/networks.test.ts
git commit -m "Add zkSync support config"
```

### Task 3: Implement timezone and report calculation utilities with TDD

**Files:**
- Create: `src/lib/timezone.ts`
- Create: `src/lib/reportMath.ts`
- Test: `src/lib/timezone.test.ts`
- Test: `src/lib/reportMath.test.ts`

**Step 1: Write failing tests**
- Verify Warsaw-local month start and end timestamps.
- Verify Warsaw-local transaction date formatting.
- Verify amount, USD, and PLN calculations and summary aggregation.

**Step 2: Run tests to verify they fail**
Run: `yarn vitest run src/lib/timezone.test.ts src/lib/reportMath.test.ts`
Expected: FAIL because modules do not exist.

**Step 3: Write minimal implementation**
- Implement pure helpers for month boundaries, display date formatting, multiplication, rounding, and totals.

**Step 4: Run tests to verify they pass**
Run: `yarn vitest run src/lib/timezone.test.ts src/lib/reportMath.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add src/lib/timezone.ts src/lib/reportMath.ts src/lib/timezone.test.ts src/lib/reportMath.test.ts
git commit -m "Add report math utilities"
```

### Task 4: Implement pricing and FX selection logic with TDD

**Files:**
- Create: `src/lib/pricing.ts`
- Create: `src/lib/fx.ts`
- Test: `src/lib/pricing.test.ts`
- Test: `src/lib/fx.test.ts`

**Step 1: Write failing tests**
- Verify the nearest CoinGecko price sample is selected.
- Verify the latest earlier NBP rate publication is selected.
- Verify unresolved inputs return explicit error states.

**Step 2: Run tests to verify they fail**
Run: `yarn vitest run src/lib/pricing.test.ts src/lib/fx.test.ts`
Expected: FAIL because modules do not exist.

**Step 3: Write minimal implementation**
- Implement pure selectors over fetched samples and NBP tables.

**Step 4: Run tests to verify they pass**
Run: `yarn vitest run src/lib/pricing.test.ts src/lib/fx.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add src/lib/pricing.ts src/lib/fx.ts src/lib/pricing.test.ts src/lib/fx.test.ts
git commit -m "Add pricing and fx selectors"
```

### Task 5: Implement external client modules and report builder

**Files:**
- Create: `src/lib/http.ts`
- Create: `src/features/report/api/coingeckoClient.ts`
- Create: `src/features/report/api/nbpClient.ts`
- Create: `src/features/report/api/zksyncClient.ts`
- Create: `src/features/report/model/buildReport.ts`
- Test: `src/features/report/model/buildReport.test.ts`

**Step 1: Write the failing test**
- Verify a set of incoming transfers plus resolved rates builds accountant rows and summary totals.
- Verify unresolved upstream data is surfaced as row errors.

**Step 2: Run test to verify it fails**
Run: `yarn vitest run src/features/report/model/buildReport.test.ts`
Expected: FAIL because the builder does not exist.

**Step 3: Write minimal implementation**
- Add thin HTTP wrappers and API clients.
- Implement report builder orchestration with pure transformations.

**Step 4: Run test to verify it passes**
Run: `yarn vitest run src/features/report/model/buildReport.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add src/lib/http.ts src/features/report/api src/features/report/model/buildReport.ts src/features/report/model/buildReport.test.ts
git commit -m "Add report data clients and builder"
```

### Task 6: Implement accountant export formatting with TDD

**Files:**
- Create: `src/features/report/model/exportText.ts`
- Test: `src/features/report/model/exportText.test.ts`

**Step 1: Write the failing test**
- Verify the accountant block matches the required Polish labels and numeric formatting.
- Verify the monthly summary block is appended.

**Step 2: Run test to verify it fails**
Run: `yarn vitest run src/features/report/model/exportText.test.ts`
Expected: FAIL because formatter does not exist.

**Step 3: Write minimal implementation**
- Implement export text formatter using report rows and summary totals.

**Step 4: Run test to verify it passes**
Run: `yarn vitest run src/features/report/model/exportText.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add src/features/report/model/exportText.ts src/features/report/model/exportText.test.ts
git commit -m "Add accountant export formatter"
```

### Task 7: Build the report UI with component tests

**Files:**
- Create: `src/features/report/components/ReportPage.tsx`
- Create: `src/features/report/components/ReportFilters.tsx`
- Create: `src/features/report/components/ReportTable.tsx`
- Create: `src/features/report/components/ReportSummary.tsx`
- Create: `src/features/report/components/ReportExport.tsx`
- Create: `src/features/report/components/ReportStatus.tsx`
- Create: `src/features/report/hooks/useReportGenerator.ts`
- Test: `src/features/report/components/ReportPage.test.tsx`

**Step 1: Write the failing test**
- Verify invalid addresses are rejected.
- Verify successful generation renders rows, summary, and export text.
- Verify empty results render the empty state.

**Step 2: Run test to verify it fails**
Run: `yarn vitest run src/features/report/components/ReportPage.test.tsx`
Expected: FAIL because UI components do not exist.

**Step 3: Write minimal implementation**
- Build the form, states, table, summary, and copyable export block.
- Use Radix Themes components for the UI.

**Step 4: Run test to verify it passes**
Run: `yarn vitest run src/features/report/components/ReportPage.test.tsx`
Expected: PASS

**Step 5: Commit**
```bash
git add src/features/report/components src/features/report/hooks/useReportGenerator.ts
git commit -m "Build report generation UI"
```

### Task 8: Final documentation and verification

**Files:**
- Create: `README.md`
- Create: `DEV.md`

**Step 1: Write docs**
- Document setup, local development, build, and usage.
- Document module structure, timezone rules, and data integrations.

**Step 2: Run full relevant verification**
Run: `yarn lint`
Run: `yarn typecheck`
Run: `yarn test:run`
Run: `yarn build`
Expected: all commands succeed with no warnings.

**Step 3: Commit**
```bash
git add README.md DEV.md
git commit -m "Document ZK PLN calculator"
```

### Task 9: Publish to GitHub

**Files:**
- Modify: `.gitignore` if needed

**Step 1: Create GitHub repository**
Run: `gh repo create zk-pay-calc --public --source=. --remote=origin --push`
Expected: repository is created and current branch is pushed.

**Step 2: Verify remote state**
Run: `git remote -v`
Run: `git status --short --branch`
Expected: `origin` exists and working tree is clean.
