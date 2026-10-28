import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { Section } from "@/components/ui/Section";
import { Accent } from "@/components/ui/Typography/Accent";
import { Heading } from "@/components/ui/Typography/Heading";
import { Kicker } from "@/components/ui/Typography/Kicker";
import { recommendationCase, recommendationResearch } from "@/content/cases/recomendacao";
import { projectPageContent } from "@/content/projectPage";
import { ensureProjectPage, getProject, projectMetadata } from "@/lib/projectPage";
import { BackHomeLink } from "@/sections/project/BackHomeLink";
import { ProjectHero } from "@/sections/project/ProjectHero";
import { MaskingDemo } from "./_components/MaskingDemo";
import { RoleSection } from "./_components/RoleSection";
import { SequenceDemo } from "./_components/SequenceDemo";

const project = getProject("recomendacao");
const { hero, demo, how, role } = recommendationCase;

export const metadata: Metadata = projectMetadata(project, recommendationCase.meta);

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
        <RoleSection
          cards={[
            {
              title: role.exploration.title,
              lines: [
                role.exploration.body,
                dataset && `${role.exploration.datasetLabel}: ${dataset}`,
                findings,
              ],
            },
            { title: role.preparation.title, lines: [role.preparation.body, preparation] },
            { title: role.training.title, lines: [role.training.body, trainingMetrics()] },
          ]}
        />
        <Section spacing="none" bordered={false} className="pb-section">
          <Container>
            <BackHomeLink />
          </Container>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
