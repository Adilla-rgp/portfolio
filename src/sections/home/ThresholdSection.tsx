import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Accent } from "@/components/ui/Typography/Accent";
import { Heading } from "@/components/ui/Typography/Heading";
import { Kicker } from "@/components/ui/Typography/Kicker";
import { Text } from "@/components/ui/Typography/Text";
import { homeContent } from "@/content/home";
import { thresholdPoints } from "@/content/threshold";
import { ThresholdExplorer } from "./threshold/ThresholdExplorer";

const { threshold } = homeContent;

export function ThresholdSection() {
  return (
    <Section tone="sunken" aria-label={threshold.ariaLabel}>
      <Container className="flex flex-wrap items-center gap-16">
        <ThresholdExplorer
          points={thresholdPoints}
          intro={
            <>
              <Kicker>{threshold.kicker}</Kicker>
              <Heading>
                {threshold.title}
                <Accent>.</Accent>
              </Heading>
              <Text className="max-w-110">{threshold.body}</Text>
            </>
          }
        />
      </Container>
    </Section>
  );
}
