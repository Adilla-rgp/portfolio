import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { Section } from "@/components/ui/Section";
import { Accent } from "@/components/ui/Typography/Accent";
import { Heading } from "@/components/ui/Typography/Heading";
import { Text } from "@/components/ui/Typography/Text";
import { formatShare } from "@/content/cache";
import type { CaseData as CaseDataContent } from "@/content/caseStudy";
import { cssVars } from "@/lib/cssVars";

interface CaseDataProps {
  data: CaseDataContent;
}

/** Horizontal bars as plain HTML: every value is also visible text. */
export function CaseData({ data }: CaseDataProps) {
  return (
    <Section id={data.id} aria-label={data.title}>
      <Container className="flex flex-wrap items-start gap-12">
        <FadeIn className="flex min-w-0 grow basis-90 flex-col gap-6">
          <Heading>
            {data.title}
            <Accent>.</Accent>
          </Heading>
          <Text size="lg" className="max-w-110">
            {data.body}
          </Text>
        </FadeIn>
        <FadeIn delay="sibling" className="flex min-w-0 grow-2 basis-140 flex-col gap-10">
          {data.groups.map((group) => (
            <figure key={group.title} className="flex flex-col gap-4">
              <Text as="figcaption" size="label" tone="muted">
                {group.title}
              </Text>
              <ul className="flex flex-col gap-3">
                {group.bars.map((bar) => (
                  <li key={bar.label} className="grid grid-cols-data-bar items-center gap-4">
                    <Text as="span" size="codeSm" tone="fg" className="truncate">
                      {bar.label}
                    </Text>
                    <span aria-hidden="true" className="relative h-3 rounded-chip bg-line">
                      <span
                        className="bar-x absolute inset-y-0 left-0 rounded-chip bg-signal"
                        style={cssVars({ "--bar": bar.value })}
                      />
                    </span>
                    <Text as="span" size="codeSm" tone="fg" className="text-right tabular-nums">
                      {formatShare(bar.value, group.fractionDigits)}
                    </Text>
                  </li>
                ))}
              </ul>
            </figure>
          ))}
        </FadeIn>
      </Container>
    </Section>
  );
}
