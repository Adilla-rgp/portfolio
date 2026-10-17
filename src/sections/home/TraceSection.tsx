import { Container } from "@/components/ui/Container";
import { PiecePlaceholder } from "@/components/ui/PiecePlaceholder";
import { Section } from "@/components/ui/Section";
import { Accent } from "@/components/ui/Typography/Accent";
import { Heading } from "@/components/ui/Typography/Heading";
import { Kicker } from "@/components/ui/Typography/Kicker";
import { Text } from "@/components/ui/Typography/Text";
import { homeContent } from "@/content/home";

const { trace } = homeContent;

export function TraceSection() {
  return (
    <Section id={trace.id} bordered={false}>
      <Container className="flex flex-wrap items-start gap-16">
        <div className="flex min-w-0 grow-5 basis-95 flex-col gap-6">
          <Kicker>{trace.kicker}</Kicker>
          <Heading>
            {trace.title}
            <Accent>.</Accent>
          </Heading>
          <Text className="max-w-110">{trace.body}</Text>
          <PiecePlaceholder label={trace.controlsPlaceholder} className="min-h-13 py-3" />
        </div>
        <PiecePlaceholder
          label={trace.panelPlaceholder}
          className="h-trace-panel min-w-0 grow-7 basis-140"
        />
      </Container>
    </Section>
  );
}
