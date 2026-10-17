import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { Section } from "@/components/ui/Section";
import { Accent } from "@/components/ui/Typography/Accent";
import { Heading } from "@/components/ui/Typography/Heading";
import { Kicker } from "@/components/ui/Typography/Kicker";
import { aboutContent } from "@/content/about";
import { timelineEvents } from "@/content/timeline";
import { TimelineExplorer } from "./timeline/TimelineExplorer";

const { timeline } = aboutContent;

export function TimelineSection() {
  return (
    <Section id={timeline.id} tone="sunken">
      <Container className="flex flex-col gap-6">
        <FadeIn className="flex flex-col gap-5">
          <Kicker>{timeline.kicker}</Kicker>
          <Heading>
            {timeline.title}
            <Accent>.</Accent>
          </Heading>
        </FadeIn>
        <FadeIn delay="sibling">
          <TimelineExplorer events={timelineEvents} />
        </FadeIn>
      </Container>
    </Section>
  );
}
