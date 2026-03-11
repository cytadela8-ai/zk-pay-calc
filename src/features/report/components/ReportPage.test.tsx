import { Theme } from "@radix-ui/themes";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { MonthlyReport } from "src/domain/report";
import { ReportPage } from "src/features/report/components/ReportPage";
import { generateMonthlyReport } from "src/features/report/model/generateReport";

vi.mock("src/features/report/model/generateReport", () => ({
  generateMonthlyReport: vi.fn(),
}));

const mockedGenerateMonthlyReport = vi.mocked(generateMonthlyReport);

const report: MonthlyReport = {
  rows: [
    {
      amountZk: "30556.94",
      date: "2026-01-19",
      fxEffectiveDate: "2026-01-16",
      notes: [],
      plnValue: "4204.08",
      txHash: "0xaaa",
      usdPlnRate: "4.0123",
      usdRate: "0.03429",
      usdValue: "1047.80",
    },
  ],
  summary: {
    resolvedCount: 1,
    totalPln: "4204.08",
    totalUsd: "1047.80",
    totalZk: "30556.94",
    unresolvedCount: 0,
  },
};

function renderReportPage(): void {
  render(
    <Theme appearance="light" accentColor="amber" grayColor="sand" radius="medium">
      <ReportPage />
    </Theme>,
  );
}

describe("ReportPage", () => {
  beforeEach(() => {
    mockedGenerateMonthlyReport.mockReset();
  });

  it("rejects invalid addresses before calling the generator", async () => {
    const user = userEvent.setup();
    renderReportPage();

    await user.type(screen.getByLabelText("Wallet address"), "not-an-address");
    await user.click(screen.getByRole("button", { name: "Generate report" }));

    expect(
      await screen.findByText("Enter a valid Ethereum-style wallet address."),
    ).toBeInTheDocument();
    expect(mockedGenerateMonthlyReport).not.toHaveBeenCalled();
  });

  it("renders rows, summary, and export text for a successful report", async () => {
    const user = userEvent.setup();
    mockedGenerateMonthlyReport.mockResolvedValueOnce(report);
    renderReportPage();

    await user.type(
      screen.getByLabelText("Wallet address"),
      "0x1234567890123456789012345678901234567890",
    );
    await user.click(screen.getByRole("button", { name: "Generate report" }));

    expect(await screen.findByText("Podsumowanie miesiąca")).toBeInTheDocument();
    expect(screen.getAllByText("30,556.94 ZK")).toHaveLength(2);
    expect(
      screen.getByDisplayValue(/W dolarach: 30,556.94 \* 0.03429 = \$1047.80/),
    ).toBeInTheDocument();
    expect(mockedGenerateMonthlyReport).toHaveBeenCalledTimes(1);
  });

  it("renders an empty state when no transfers are found", async () => {
    const user = userEvent.setup();
    mockedGenerateMonthlyReport.mockResolvedValueOnce({
      rows: [],
      summary: {
        resolvedCount: 0,
        totalPln: "0.00",
        totalUsd: "0.00",
        totalZk: "0.00",
        unresolvedCount: 0,
      },
    });
    renderReportPage();

    await user.type(
      screen.getByLabelText("Wallet address"),
      "0x1234567890123456789012345678901234567890",
    );
    await user.click(screen.getByRole("button", { name: "Generate report" }));

    expect(
      await screen.findByText("No incoming ZK transfers were found for this month."),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(mockedGenerateMonthlyReport).toHaveBeenCalledTimes(1);
    });
  });
});
