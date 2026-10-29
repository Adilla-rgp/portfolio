import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { Section } from "@/components/ui/Section";
import { Accent } from "@/components/ui/Typography/Accent";
import { Heading } from "@/components/ui/Typography/Heading";
import { Kicker } from "@/components/ui/Typography/Kicker";
import { Text } from "@/components/ui/Typography/Text";
import { homeContent } from "@/content/home";
import { CacheCalculator } from "./cache/CacheCalculator";
import { RecoveryChart } from "./cache/RecoveryChart";

const { threshold } = homeContent;

/** The tutoring agents' answer cache: a Jaccard calculator and its measured recovery rate. */
export function ThresholdSection() {
  return (
    <Section tone="sunken" aria-label={threshold.ariaLabel}>
      <Container className="flex flex-wrap items-start gap-16">
        <FadeIn className="flex min-w-0 grow-10 basis-90 flex-col gap-10">
          <div className="flex flex-col gap-6">
            <Kicker>{threshold.kicker}</Kicker>
            <Heading>
              {threshold.title}
              <Accent>.</Accent>
            </Heading>
            <Text className="max-w-110">{threshold.body}</Text>
          </div>
          <RecoveryChart />
        </FadeIn>

        <FadeIn delay="sibling" className="flex min-w-0 grow-13 basis-140 flex-col">
          <CacheCalculator />
        </FadeIn>
      </Container>
    </Section>
  );
}
