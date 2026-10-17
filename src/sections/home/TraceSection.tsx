import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Accent } from "@/components/ui/Typography/Accent";
import { Heading } from "@/components/ui/Typography/Heading";
import { Kicker } from "@/components/ui/Typography/Kicker";
import { Text } from "@/components/ui/Typography/Text";
import { homeContent } from "@/content/home";
import { TraceDemo } from "./trace/TraceDemo";

const { trace } = homeContent;

export function TraceSection() {
  return (
    <Section id={trace.id} bordered={false}>
      <Container className="flex flex-wrap items-start gap-16">
        <TraceDemo
          intro={
            <>
              <Kicker>{trace.kicker}</Kicker>
              <Heading>
                {trace.title}
                <Accent>.</Accent>
              </Heading>
              <Text className="max-w-110">{trace.body}</Text>
            </>
          }
        />
      </Container>
    </Section>
  );
}
