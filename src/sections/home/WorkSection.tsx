import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Typography/Heading";
import { homeContent } from "@/content/home";
import { WorkList } from "./WorkList";

const { work } = homeContent;

export function WorkSection() {
  return (
    <Section id={work.id}>
      <Container className="flex flex-col gap-10">
        <FadeIn>
          <Heading>{work.title}</Heading>
        </FadeIn>
        <FadeIn delay="sibling">
          <WorkList />
        </FadeIn>
      </Container>
    </Section>
  );
}
