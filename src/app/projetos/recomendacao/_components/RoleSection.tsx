import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { Section } from "@/components/ui/Section";
import { Accent } from "@/components/ui/Typography/Accent";
import { Heading } from "@/components/ui/Typography/Heading";
import { Text } from "@/components/ui/Typography/Text";
import { recommendationCase } from "@/content/cases/recomendacao";

const { role } = recommendationCase;
const INDEX_DIGITS = 2;

export interface RoleCardContent {
  title: string;
  /** Lines still without real content (null) are left out. */
  lines: readonly (string | null)[];
}

interface VisibleCard {
  title: string;
  lines: string[];
}

/** Cards with no line left are dropped, title included. */
export function visibleRoleCards(cards: readonly RoleCardContent[]): VisibleCard[] {
  return cards
    .map((card) => ({
      title: card.title,
      lines: card.lines.filter((line): line is string => line !== null && line.trim() !== ""),
    }))
    .filter((card) => card.lines.length > 0);
}

interface RoleSectionProps {
  cards: readonly RoleCardContent[];
}

/** "O que eu fiz". Renders nothing at all when no card has content. */
export function RoleSection({ cards }: RoleSectionProps) {
  const visible = visibleRoleCards(cards);
  if (visible.length === 0) return null;

  return (
    <Section aria-label={role.ariaLabel} className="pb-14">
      <Container className="flex flex-col gap-10">
        <Heading>
          {role.title}
          <Accent>.</Accent>
        </Heading>
        <FadeIn className="grid gap-4 md:grid-cols-3">
          {visible.map((card, index) => (
            <Card key={card.title} className="flex flex-col gap-3.5">
              <Text as="span" size="mono" tone="signal">
                {String(index + 1).padStart(INDEX_DIGITS, "0")}
              </Text>
              <Heading as="h3" size="node">
                {card.title}
              </Heading>
              {card.lines.map((line) => (
                <Text key={line}>{line}</Text>
              ))}
            </Card>
          ))}
        </FadeIn>
      </Container>
    </Section>
  );
}
