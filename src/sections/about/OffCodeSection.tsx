import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { Section } from "@/components/ui/Section";
import { Accent } from "@/components/ui/Typography/Accent";
import { Heading } from "@/components/ui/Typography/Heading";
import { Kicker } from "@/components/ui/Typography/Kicker";
import { Text } from "@/components/ui/Typography/Text";
import { aboutContent } from "@/content/about";

const { offCode } = aboutContent;

export function OffCodeSection() {
  return (
    <Section aria-label={offCode.ariaLabel}>
      <Container className="flex flex-wrap gap-12">
        <FadeIn className="flex grow basis-80 flex-col gap-5">
          <Kicker>{offCode.kicker}</Kicker>
          <Heading>
            {offCode.title}
            <Accent>.</Accent>
          </Heading>
        </FadeIn>
        <FadeIn delay="sibling" className="min-w-0 grow-2 basis-140">
          <ul className="border-t border-line-strong">
            {offCode.items.map((item) => (
              <li
                key={item.name}
                className="flex flex-col gap-3 border-b border-line-strong py-7"
              >
                <Heading as="h3" size="h3" className="uppercase">
                  {item.name}
                </Heading>
                <Text className="max-w-160">{item.body}</Text>
              </li>
            ))}
          </ul>
        </FadeIn>
      </Container>
    </Section>
  );
}
