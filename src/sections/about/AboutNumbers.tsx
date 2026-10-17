import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { Section } from "@/components/ui/Section";
import { Accent } from "@/components/ui/Typography/Accent";
import { Heading } from "@/components/ui/Typography/Heading";
import { Text } from "@/components/ui/Typography/Text";
import { aboutContent, type AboutNumber } from "@/content/about";
import { CountUp } from "./numbers/CountUp";

const { numbers } = aboutContent;

function NumberValue({ item }: { item: AboutNumber }) {
  if ("text" in item) return item.text;
  return (
    <>
      <CountUp value={item.value} />
      {"suffix" in item && <Accent>{item.suffix}</Accent>}
    </>
  );
}

export function AboutNumbers() {
  return (
    <Section spacing="none" aria-label={numbers.ariaLabel} className="border-b border-line">
      <Container>
        <FadeIn>
          <dl className="flex flex-wrap">
            {numbers.items.map((item) => (
              // dt comes first for the dl semantics; the column is reversed so the figure sits on top.
              <div key={item.id} className="flex grow basis-60 flex-col-reverse gap-2.5 py-9 pr-6">
                <Text as="dt" size="label" tone="muted">
                  {item.label}
                </Text>
                <Heading as="dd" size="number">
                  <NumberValue item={item} />
                </Heading>
              </div>
            ))}
          </dl>
        </FadeIn>
      </Container>
    </Section>
  );
}
