import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { Section } from "@/components/ui/Section";
import { Accent } from "@/components/ui/Typography/Accent";
import { Heading } from "@/components/ui/Typography/Heading";
import { Kicker } from "@/components/ui/Typography/Kicker";
import { Text } from "@/components/ui/Typography/Text";
import { aboutContent } from "@/content/about";
import { projects } from "@/content/projects";
import { stackProjects, stackTechs } from "@/content/stack";
import { visibleStack } from "@/lib/stackMap";
import { StackMap } from "./stack/StackMap";

const { stack } = aboutContent;
const hiddenProjectIds = projects.filter((project) => !project.isListed).map((project) => project.id);
const visible = visibleStack(stackTechs, stackProjects, hiddenProjectIds);

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
          <StackMap techs={visible.techs} projects={visible.projects} />
        </FadeIn>
      </Container>
    </Section>
  );
}
