import { Button, Flex, Text } from "@radix-ui/themes";
import type { FormEvent } from "react";

import type { SupportedNetwork, SupportedToken } from "src/domain/report";

interface ReportFiltersProps {
  address: string;
  addressError: string | null;
  loading: boolean;
  month: string;
  monthError: string | null;
  network: SupportedNetwork;
  token: SupportedToken;
  onAddressChange: (value: string) => void;
  onMonthChange: (value: string) => void;
  onSubmit: () => void;
}

export function ReportFilters(props: ReportFiltersProps): JSX.Element {
  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    props.onSubmit();
  }

  return (
    <form className="ledger-card filter-card" onSubmit={handleSubmit}>
      <Flex direction="column" gap="4">
        <div className="card-heading">
          <Text as="p" size="2" weight="bold" className="eyebrow">
            Report filters
          </Text>
          <Text as="p" size="3" className="muted-copy">
            Choose a Warsaw-time month and the receiving wallet address.
          </Text>
        </div>
        <div className="filter-grid">
          <label className="field-label" htmlFor="report-month">
            <span>Month</span>
            <input
              id="report-month"
              className="ledger-input"
              type="month"
              value={props.month}
              onChange={(event) => props.onMonthChange(event.target.value)}
            />
          </label>
          <label className="field-label field-address" htmlFor="wallet-address">
            <span>Wallet address</span>
            <input
              id="wallet-address"
              className="ledger-input"
              type="text"
              placeholder="0x..."
              value={props.address}
              onChange={(event) => props.onAddressChange(event.target.value)}
            />
          </label>
          <label className="field-label" htmlFor="chain-selector">
            <span>Chain</span>
            <select id="chain-selector" className="ledger-input" value={props.network.id} disabled>
              <option value={props.network.id}>{props.network.name}</option>
            </select>
          </label>
          <label className="field-label" htmlFor="token-selector">
            <span>Token</span>
            <select
              id="token-selector"
              className="ledger-input"
              value={props.token.address}
              disabled
            >
              <option value={props.token.address}>{props.token.symbol}</option>
            </select>
          </label>
        </div>
        {props.monthError === null ? null : (
          <Text as="p" size="2" className="error-copy">
            {props.monthError}
          </Text>
        )}
        {props.addressError === null ? null : (
          <Text as="p" size="2" className="error-copy">
            {props.addressError}
          </Text>
        )}
        <Flex justify="end">
          <Button size="3" type="submit" disabled={props.loading}>
            {props.loading ? "Generating..." : "Generate report"}
          </Button>
        </Flex>
      </Flex>
    </form>
  );
}
