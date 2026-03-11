import { Callout, Text } from "@radix-ui/themes";
import { ExclamationTriangleIcon, InfoCircledIcon } from "@radix-ui/react-icons";

import type { ReportProgress } from "src/domain/report";

interface ReportStatusProps {
  errorMessage: string | null;
  loading: boolean;
  progress: ReportProgress | null;
  showEmpty: boolean;
}

export function ReportStatus(props: ReportStatusProps): JSX.Element | null {
  if (props.loading) {
    const progressLabel =
      props.progress === null
        ? "Preparing report range"
        : `Step ${props.progress.currentStep} of ${props.progress.totalSteps}: ` +
          props.progress.label;

    return (
      <Callout.Root className="ledger-card status-card" color="amber" role="status">
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>{progressLabel}</Callout.Text>
      </Callout.Root>
    );
  }

  if (props.errorMessage !== null) {
    return (
      <Callout.Root className="ledger-card status-card" color="red" role="alert">
        <Callout.Icon>
          <ExclamationTriangleIcon />
        </Callout.Icon>
        <Callout.Text>{props.errorMessage}</Callout.Text>
      </Callout.Root>
    );
  }

  if (props.showEmpty) {
    return (
      <div className="ledger-card status-card empty-card">
        <Text as="p" size="4" weight="medium">
          No incoming ZK transfers were found for this month.
        </Text>
      </div>
    );
  }

  return null;
}
