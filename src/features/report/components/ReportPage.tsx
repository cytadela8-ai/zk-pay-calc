import { Container, Flex, Heading, Section, Text } from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";

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

const ADDRESS_STORAGE_KEY = "zk-pay-calc:last-wallet-address";
const MONTH_PATTERN = /^\d{4}-\d{2}$/;

export function ReportPage(): JSX.Element {
  const network = SUPPORTED_NETWORKS[0];
  const token = network.tokens[0] as SupportedToken;
  const [month, setMonth] = useState(getPreviousWarsawMonth());
  const [address, setAddress] = useState(
    () => window.localStorage.getItem(ADDRESS_STORAGE_KEY) ?? "",
  );
  const [addressError, setAddressError] = useState<string | null>(null);
  const [monthError, setMonthError] = useState<string | null>(null);
  const { errorMessage, generate, progress, report, status } = useReportGenerator();

  useEffect(() => {
    window.localStorage.setItem(ADDRESS_STORAGE_KEY, address);
  }, [address]);

  const exportText = useMemo(() => {
    if (report === null || report.rows.length === 0) {
      return "";
    }

    return formatAccountantReport(report);
  }, [report]);

  async function handleSubmit(): Promise<void> {
    if (!MONTH_PATTERN.test(month)) {
      setMonthError("Choose a report month in YYYY-MM format.");
      return;
    }

    setMonthError(null);
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
              Monthly export
            </Text>
            <Heading size="8" className="hero-heading">
              ZK PLN report
            </Heading>
            <Text as="p" size="4" className="hero-copy">
              Generate an accountant-ready report for incoming ZK receipts on zkSync Era.
            </Text>
          </header>
          <ReportFilters
            address={address}
            addressError={addressError}
            loading={status === "loading"}
            month={month}
            monthError={monthError}
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
            progress={progress}
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
