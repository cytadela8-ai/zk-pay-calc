import { useState } from "react";

import type { MonthlyReport, ReportProgress } from "src/domain/report";

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
  progress: ReportProgress | null;
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
    progress: null,
    report: null,
    status: "idle",
  });

  async function generate(input: GenerateReportInput): Promise<void> {
    setState({
      errorMessage: null,
      progress: {
        currentStep: 1,
        label: "Preparing report range",
        totalSteps: 5,
      },
      report: null,
      status: "loading",
    });

    try {
      const { generateMonthlyReport } = await import("src/features/report/model/generateReport");
      const report = await generateMonthlyReport({
        ...input,
        onProgress: (progress) => {
          setState((currentState) => ({
            ...currentState,
            progress,
          }));
        },
      });
      setState({
        errorMessage: null,
        progress: null,
        report,
        status: "success",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error.";
      setState({
        errorMessage: `Report generation failed: ${message}`,
        progress: null,
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
