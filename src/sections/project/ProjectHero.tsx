import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { RevealText } from "@/components/ui/RevealText";
import { Section } from "@/components/ui/Section";
import { Accent } from "@/components/ui/Typography/Accent";
import { Heading } from "@/components/ui/Typography/Heading";
import { Kicker } from "@/components/ui/Typography/Kicker";
import { Text } from "@/components/ui/Typography/Text";

interface ProjectHeroProps {
  kicker: ReactNode;
  /** One entry per masked line; the last one ends with `titleEnd` in signal. */
  titleLines: readonly string[];
  titleEnd?: string;
  size?: "displayXl" | "displayPage";
  intro: string;
  /** Right-hand block under the title, e.g. the project facts. */
  aside?: ReactNode;
}

export function ProjectHero({
  kicker,
  titleLines,
  titleEnd = ".",
  size = "displayXl",
  intro,
  aside,
}: ProjectHeroProps) {
  const lines = titleLines.map((line, index) =>
    index === titleLines.length - 1 ? (
      <>
        {line}
        <Accent>{titleEnd}</Accent>
      </>
    ) : (
      line
    ),
  );

  return (
    <Section spacing="none" bordered={false} className="pt-22 pb-16">
      <Container className="flex flex-col gap-8">
        <Kicker>{kicker}</Kicker>
        <Heading as="h1" size={size} className="uppercase">
          <RevealText lines={lines} />
        </Heading>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Text size="lg" className="max-w-160">
            {intro}
          </Text>
          {aside && <FadeIn delay="sibling">{aside}</FadeIn>}
        </div>
      </Container>
    </Section>
  );
}
