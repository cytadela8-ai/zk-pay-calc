import { Container, Flex, Heading, Section, Text } from "@radix-ui/themes";
import { useMemo, useState } from "react";

import { SUPPORTED_NETWORKS } from "src/config/networks";
import type { SupportedToken } from "src/domain/report";
import { ReportExport } from "src/features/report/components/ReportExport";
import { ReportFilters } from "src/features/report/components/ReportFilters";
import { ReportStatus } from "src/features/report/components/ReportStatus";
import { ReportSummary } from "src/features/report/components/ReportSummary";
import { ReportTable } from "src/features/report/components/ReportTable";
import { useReportGenerator } from "src/features/report/hooks/useReportGenerator";
import { formatAccountantReport } from "src/features/report/model/exportText";
import { getPreviousWarsawMonth } from "src/lib/timezone";

export function ReportPage(): JSX.Element {
  const network = SUPPORTED_NETWORKS[0];
  const token = network.tokens[0] as SupportedToken;
  const [month, setMonth] = useState(getPreviousWarsawMonth());
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState<string | null>(null);
  const { errorMessage, generate, report, status } = useReportGenerator();

  const exportText = useMemo(() => {
    if (report === null || report.rows.length === 0) {
      return "";
    }

    return formatAccountantReport(report);
  }, [report]);

  async function handleSubmit(): Promise<void> {
    const { isAddress } = await import("ethers");
    if (!isAddress(address)) {
      setAddressError("Enter a valid Ethereum-style wallet address.");
      return;
    }

    setAddressError(null);
    await generate({
      address,
      month,
      networkId: network.id,
      tokenAddress: token.address,
    });
  }

  return (
    <Section size="4">
      <Container size="4">
        <Flex direction="column" gap="5">
          <header className="hero-card">
            <Text as="p" size="2" weight="bold" className="eyebrow">
              Warsaw-time ledger
            </Text>
            <Heading size="9" className="hero-heading">
              ZK to PLN monthly accountant report
            </Heading>
            <Text as="p" size="4" className="hero-copy">
              Generate a clean month-by-month ledger of incoming ZK receipts on zkSync Era with
              CoinGecko USD pricing and NBP USD/PLN conversion.
            </Text>
          </header>
          <ReportFilters
            address={address}
            addressError={addressError}
            loading={status === "loading"}
            month={month}
            network={network}
            token={token}
            onAddressChange={setAddress}
            onMonthChange={setMonth}
            onSubmit={() => {
              void handleSubmit();
            }}
          />
          <ReportStatus
            errorMessage={errorMessage}
            loading={status === "loading"}
            showEmpty={status === "success" && report !== null && report.rows.length === 0}
          />
          {report === null || report.rows.length === 0 ? null : (
            <>
              <ReportSummary summary={report.summary} />
              <ReportTable rows={report.rows} />
              <ReportExport reportText={exportText} />
            </>
          )}
        </Flex>
      </Container>
    </Section>
  );
}
