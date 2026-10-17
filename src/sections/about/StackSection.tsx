import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { Section } from "@/components/ui/Section";
import { Accent } from "@/components/ui/Typography/Accent";
import { Heading } from "@/components/ui/Typography/Heading";
import { Kicker } from "@/components/ui/Typography/Kicker";
import { Text } from "@/components/ui/Typography/Text";
import { aboutContent } from "@/content/about";
import { stackProjects, stackTechs } from "@/content/stack";
import { StackMap } from "./stack/StackMap";

const { stack } = aboutContent;

export function StackSection() {
  return (
    <Section id={stack.id} bordered={false}>
      <Container className="flex flex-col gap-10">
        <FadeIn className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-5">
            <Kicker>{stack.kicker}</Kicker>
            <Heading>
              {stack.title}
              <Accent>.</Accent>
            </Heading>
          </div>
          <Text className="max-w-110">{stack.body}</Text>
        </FadeIn>
        <FadeIn delay="sibling">
          <StackMap techs={stackTechs} projects={stackProjects} />
        </FadeIn>
      </Container>
    </Section>
  );
}
