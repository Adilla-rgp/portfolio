import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { PiecePlaceholder } from "@/components/ui/PiecePlaceholder";
import { Section } from "@/components/ui/Section";
import { Accent } from "@/components/ui/Typography/Accent";
import { Heading } from "@/components/ui/Typography/Heading";
import { Kicker } from "@/components/ui/Typography/Kicker";
import { Text } from "@/components/ui/Typography/Text";
import { homeContent } from "@/content/home";

const { threshold } = homeContent;

export function ThresholdSection() {
  return (
    <Section tone="sunken" aria-label={threshold.ariaLabel}>
      <Container className="flex flex-wrap items-center gap-16">
        <FadeIn className="flex min-w-0 grow-10 basis-90 flex-col gap-6">
          <Kicker>{threshold.kicker}</Kicker>
          <Heading>
            {threshold.title}
            <Accent>.</Accent>
          </Heading>
          <Text className="max-w-110">{threshold.body}</Text>
          <dl className="grid grid-cols-2 gap-4">
            {threshold.stats.map((stat) => (
              <Card
                key={stat.id}
                variant="outline"
                radius="item"
                padding="sm"
                className="flex flex-col gap-1.5"
              >
                <Text as="dt" size="label" tone="muted">
                  {stat.label}
                </Text>
                <Heading as="dd" size="stat" tone={stat.accent ? "signal" : "default"}>
                  {stat.value}
                </Heading>
              </Card>
            ))}
          </dl>
          <Text size="label" tone="muted">
            {threshold.verdict}
          </Text>
        </FadeIn>
        <FadeIn delay="sibling" className="flex min-w-0 grow-13 basis-140 flex-col gap-4">
          <PiecePlaceholder label={threshold.chartPlaceholder} className="aspect-chart" />
          <PiecePlaceholder label={threshold.controlsPlaceholder} className="h-chart-controls" />
        </FadeIn>
      </Container>
    </Section>
  );
}
