import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { Accent } from "@/components/ui/Typography/Accent";
import { Heading } from "@/components/ui/Typography/Heading";
import { Text } from "@/components/ui/Typography/Text";
import { cosmoCase, type CaseLink } from "@/content/cases/cosmo";

const { today } = cosmoCase;

interface CosmoTodayProps {
  /** Links without a destination yet are left out, buttons and column both. */
  links?: readonly CaseLink[];
}

export function CosmoToday({ links: allLinks = today.links }: CosmoTodayProps) {
  const links = allLinks.filter((link): link is CaseLink & { href: string } => link.href !== null);

  return (
    <Section id={today.id}>
      <Container className="flex flex-wrap items-end gap-12">
        <FadeIn className="flex min-w-0 grow-2 basis-140 flex-col gap-6">
          <Heading>
            {today.title}
            <Accent>.</Accent>
          </Heading>
          <Text size="lg" className="max-w-160">
            {today.body}
          </Text>
          <ul className="flex flex-wrap gap-2">
            {today.tags.map((tag) => (
              <li key={tag}>
                <Tag>{tag}</Tag>
              </li>
            ))}
          </ul>
        </FadeIn>
        {links.length > 0 && (
          <FadeIn delay="sibling" className="flex grow basis-75 flex-col gap-3">
            {links.map((link, index) => (
              <Button
                key={link.label}
                as="a"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                variant={index === 0 ? "signal" : "outline"}
              >
                {link.label}
              </Button>
            ))}
          </FadeIn>
        )}
      </Container>
    </Section>
  );
}
