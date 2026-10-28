import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { Section } from "@/components/ui/Section";
import { Accent } from "@/components/ui/Typography/Accent";
import { Heading } from "@/components/ui/Typography/Heading";
import { Kicker } from "@/components/ui/Typography/Kicker";
import { Text } from "@/components/ui/Typography/Text";
import { recommendationCase, recommendationResearch } from "@/content/cases/recomendacao";
import { projectPageContent } from "@/content/projectPage";
import { ensureProjectPage, getProject, projectMetadata } from "@/lib/projectPage";
import { BackHomeLink } from "@/sections/project/BackHomeLink";
import { ProjectHero } from "@/sections/project/ProjectHero";
import { MaskingDemo } from "./_components/MaskingDemo";
import { SequenceDemo } from "./_components/SequenceDemo";

const project = getProject("recomendacao");
const { hero, demo, how, role } = recommendationCase;
const INDEX_DIGITS = 2;

export const metadata: Metadata = projectMetadata(project, recommendationCase.meta);

interface RoleCardProps {
  index: number;
  title: string;
  /** Lines with no real content yet (null) are left out. */
  lines: readonly (string | null)[];
}

function RoleCard({ index, title, lines }: RoleCardProps) {
  return (
    <Card className="flex flex-col gap-3.5">
      <Text as="span" size="mono" tone="signal">
        {String(index + 1).padStart(INDEX_DIGITS, "0")}
      </Text>
      <Heading as="h3" size="node">
        {title}
      </Heading>
      {lines
        .filter((line): line is string => line !== null)
        .map((line) => (
          <Text key={line}>{line}</Text>
        ))}
    </Card>
  );
}

function trainingMetrics(): string | null {
  const { hrAt10, ndcgAt10, baseline } = recommendationResearch.metrics;
  if (hrAt10 === null || ndcgAt10 === null) return null;
  return role.training.metrics(hrAt10, ndcgAt10, baseline);
}

export default function RecommendationPage() {
  ensureProjectPage(project);
  const { dataset, findings, preparation } = recommendationResearch;

  return (
    <>
      <SiteHeader
        homeHref={projectPageContent.homeHref}
        items={recommendationCase.nav}
        className="border-b border-line"
      />
      <main>
        <ProjectHero
          kicker={hero.kicker}
          titleLines={hero.titleLines}
          titleEnd={hero.titleEnd}
          size="displayPage"
          intro={hero.intro}
        />
        <Section tone="sunken" aria-label={demo.ariaLabel} className="border-b pt-18 pb-24">
          <Container>
            <SequenceDemo />
          </Container>
        </Section>
        <Section id={how.id} bordered={false} aria-labelledby="recomendacao-como-titulo">
          <Container className="flex flex-col gap-10">
            <FadeIn className="flex flex-col gap-5">
              <Kicker>{how.kicker}</Kicker>
              <Heading id="recomendacao-como-titulo">
                {how.title}
                <Accent>.</Accent>
              </Heading>
            </FadeIn>
            <MaskingDemo />
          </Container>
        </Section>
        <Section aria-label={role.ariaLabel}>
          <Container className="flex flex-col gap-10">
            <Heading>
              {role.title}
              <Accent>.</Accent>
            </Heading>
            <FadeIn className="grid gap-4 md:grid-cols-3">
              <RoleCard
                index={0}
                title={role.exploration.title}
                lines={[
                  role.exploration.body,
                  dataset && `${role.exploration.datasetLabel}: ${dataset}`,
                  findings,
                ]}
              />
              <RoleCard
                index={1}
                title={role.preparation.title}
                lines={[role.preparation.body, preparation]}
              />
              <RoleCard
                index={2}
                title={role.training.title}
                lines={[role.training.body, trainingMetrics()]}
              />
            </FadeIn>
            <BackHomeLink />
          </Container>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
