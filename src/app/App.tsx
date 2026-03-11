import { Container, Flex, Heading, Section, Text } from "@radix-ui/themes";

export function App(): JSX.Element {
  return (
    <Section size="4">
      <Container size="4">
        <Flex direction="column" gap="4">
          <Text size="2" weight="bold" className="eyebrow">
            Accountant Ledger
          </Text>
          <Heading size="9" className="hero-heading">
            ZK to PLN monthly report generator
          </Heading>
          <Text size="4" className="hero-copy">
            Loading the report workspace.
          </Text>
        </Flex>
      </Container>
    </Section>
  );
}
