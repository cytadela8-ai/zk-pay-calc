import { Heading, Table, Text } from "@radix-ui/themes";

import type { ReportRow } from "src/domain/report";
import { formatTokenAmount } from "src/lib/reportMath";

interface ReportTableProps {
  rows: ReportRow[];
}

export function ReportTable(props: ReportTableProps): JSX.Element {
  return (
    <section className="ledger-card table-card">
      <Heading size="7" className="section-title">
        Incoming transfers
      </Heading>
      <Table.Root variant="surface" className="ledger-table">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Amount</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>USD rate</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>USD value</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>USD/PLN</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>PLN value</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Notes</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {props.rows.map((row) => (
            <Table.Row key={row.txHash}>
              <Table.RowHeaderCell>{row.date}</Table.RowHeaderCell>
              <Table.Cell>{formatTokenAmount(row.amountZk, "ZK")}</Table.Cell>
              <Table.Cell>{row.usdRate === null ? "Unresolved" : `$${row.usdRate}`}</Table.Cell>
              <Table.Cell>{row.usdValue === null ? "Unresolved" : `$${row.usdValue}`}</Table.Cell>
              <Table.Cell>
                {row.usdPlnRate === null
                  ? "Unresolved"
                  : `${row.usdPlnRate} (${row.fxEffectiveDate})`}
              </Table.Cell>
              <Table.Cell>
                {row.plnValue === null ? "Unresolved" : `${row.plnValue} PLN`}
              </Table.Cell>
              <Table.Cell>
                {row.notes.length === 0 ? (
                  <Text size="2" color="gray">
                    OK
                  </Text>
                ) : (
                  row.notes.join(" ")
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </section>
  );
}
