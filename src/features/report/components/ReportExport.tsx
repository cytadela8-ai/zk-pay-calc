import { Button, Flex, Heading } from "@radix-ui/themes";
import { useState } from "react";

interface ReportExportProps {
  reportText: string;
}

export function ReportExport(props: ReportExportProps): JSX.Element {
  const [copied, setCopied] = useState(false);

  async function handleCopy(): Promise<void> {
    await navigator.clipboard.writeText(props.reportText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section className="ledger-card export-card">
      <Flex align="center" justify="between" gap="3" wrap="wrap">
        <Heading size="7" className="section-title">
          Export text
        </Heading>
        <Button variant="soft" onClick={() => void handleCopy()}>
          {copied ? "Copied" : "Copy report"}
        </Button>
      </Flex>
      <textarea
        className="export-textarea"
        readOnly
        value={props.reportText}
        aria-label="Export text"
      />
    </section>
  );
}
