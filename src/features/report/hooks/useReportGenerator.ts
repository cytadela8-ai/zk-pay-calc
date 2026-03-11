import { useState } from "react";

import type { MonthlyReport } from "src/domain/report";

interface GenerateReportInput {
  month: string;
  address: string;
  networkId: string;
  tokenAddress: string;
}

type ReportStatus = "idle" | "loading" | "success" | "error";

interface ReportGeneratorState {
  status: ReportStatus;
  report: MonthlyReport | null;
  errorMessage: string | null;
}

interface ReportGeneratorResult extends ReportGeneratorState {
  generate: (input: GenerateReportInput) => Promise<void>;
}

/**
 * Manages report generation lifecycle state for the report page.
 *
 * @returns Generation status, report data, and a submit action.
 */
export function useReportGenerator(): ReportGeneratorResult {
  const [state, setState] = useState<ReportGeneratorState>({
    errorMessage: null,
    report: null,
    status: "idle",
  });

  async function generate(input: GenerateReportInput): Promise<void> {
    setState({
      errorMessage: null,
      report: null,
      status: "loading",
    });

    try {
      const { generateMonthlyReport } = await import("src/features/report/model/generateReport");
      const report = await generateMonthlyReport(input);
      setState({
        errorMessage: null,
        report,
        status: "success",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error.";
      setState({
        errorMessage: `Report generation failed: ${message}`,
        report: null,
        status: "error",
      });
    }
  }

  return {
    ...state,
    generate,
  };
}
