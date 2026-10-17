import { LensName } from "@/components/lens/LensCopy";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Typography/Heading";
import { Text } from "@/components/ui/Typography/Text";
import { homeContent } from "@/content/home";
import { stagger } from "@/lib/motion";
import { WorkList } from "./WorkList";

const { work } = homeContent;

export function WorkSection() {
  return (
    <Section id={work.id}>
      <Container className="flex flex-col gap-10">
        <FadeIn className="flex flex-wrap items-end justify-between gap-4">
          <Heading>{work.title}</Heading>
          <Text size="mono" tone="muted">
            {work.orderPrefix}
            <LensName />
          </Text>
        </FadeIn>
        <FadeIn delay={stagger.sibling}>
          <WorkList />
        </FadeIn>
      </Container>
    </Section>
  );
}
