import { LensName } from "@/components/lens/LensCopy";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Typography/Heading";
import { Text } from "@/components/ui/Typography/Text";
import { homeContent } from "@/content/home";
import { WorkList } from "./WorkList";

const { work } = homeContent;

export function WorkSection() {
  return (
    <Section id={work.id}>
      <Container className="flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Heading>{work.title}</Heading>
          <Text size="mono" tone="muted">
            {work.orderPrefix}
            <LensName />
          </Text>
        </div>
        <WorkList />
      </Container>
    </Section>
  );
}
