import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { caseStudyContent, type CaseStudy } from "@/content/caseStudy";
import { projectPageContent } from "@/content/projectPage";
import type { Project } from "@/content/projects";
import { ensureProjectPage } from "@/lib/projectPage";
import { ProjectHero } from "@/sections/project/ProjectHero";
import { CaseFacts } from "./CaseFacts";
import { CaseToday } from "./CaseToday";
import { DecisionTour } from "./DecisionTour";

interface CaseStudyPageProps<NodeId extends string> {
  project: Project;
  content: CaseStudy<NodeId>;
}

/** Case study told through its decisions: hero, decision tour, where it is today. */
export function CaseStudyPage<NodeId extends string>({
  project,
  content,
}: CaseStudyPageProps<NodeId>) {
  ensureProjectPage(project);
  const { hero, decisions } = content;

  return (
    <>
      <SiteHeader
        homeHref={projectPageContent.homeHref}
        items={content.nav}
        className="border-b border-line"
      />
      <main>
        <ProjectHero
          kicker={hero.kicker}
          titleLines={hero.titleLines}
          size={hero.titleSize}
          intro={hero.intro}
          aside={<CaseFacts project={project} facts={hero.facts} />}
        />
        {decisions && (
          <Section tone="sunken" aria-label={caseStudyContent.decisions.ariaLabel} className="pt-18">
            <Container>
              <DecisionTour
                title={decisions.title}
                decisions={decisions.items}
                architecture={decisions.architecture}
                diagramName={decisions.diagramName}
              />
            </Container>
          </Section>
        )}
        <CaseToday today={content.today} />
      </main>
      <SiteFooter />
    </>
  );
}
