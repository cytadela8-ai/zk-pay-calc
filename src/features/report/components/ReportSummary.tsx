import { Grid, Heading, Text } from "@radix-ui/themes";

import type { MonthlyReport } from "src/domain/report";
import { formatTokenAmount } from "src/lib/reportMath";

interface ReportSummaryProps {
  summary: MonthlyReport["summary"];
}

export function ReportSummary(props: ReportSummaryProps): JSX.Element {
  return (
    <section className="ledger-card summary-card">
      <Heading size="7" className="section-title">
        Podsumowanie miesiąca
      </Heading>
      <Grid columns={{ initial: "1", sm: "2", lg: "5" }} gap="4">
        <div>
          <Text as="p" size="2" className="eyebrow">
            Total ZK
          </Text>
          <Text as="p" size="5" weight="bold">
            {formatTokenAmount(props.summary.totalZk, "ZK")}
          </Text>
        </div>
        <div>
          <Text as="p" size="2" className="eyebrow">
            Total USD
          </Text>
          <Text as="p" size="5" weight="bold">
            ${props.summary.totalUsd}
          </Text>
        </div>
        <div>
          <Text as="p" size="2" className="eyebrow">
            Total PLN
          </Text>
          <Text as="p" size="5" weight="bold">
            {props.summary.totalPln} PLN
          </Text>
        </div>
        <div>
          <Text as="p" size="2" className="eyebrow">
            Resolved rows
          </Text>
          <Text as="p" size="5" weight="bold">
            {props.summary.resolvedCount}
          </Text>
        </div>
        <div>
          <Text as="p" size="2" className="eyebrow">
            Unresolved rows
          </Text>
          <Text as="p" size="5" weight="bold">
            {props.summary.unresolvedCount}
          </Text>
        </div>
      </Grid>
    </section>
  );
}
