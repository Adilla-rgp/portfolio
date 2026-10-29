import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Typography/Text";
import { cosmoCase } from "@/content/cases/cosmo";
import { decisions } from "@/content/decisions";
import { projectPageContent } from "@/content/projectPage";
import { ensureProjectPage, getProject, projectMetadata } from "@/lib/projectPage";
import { ProjectHero } from "@/sections/project/ProjectHero";
import { ProjectStatus } from "@/sections/project/ProjectStatus";
import { CosmoToday } from "./_components/CosmoToday";
import { DecisionTour } from "./_components/DecisionTour";

const project = getProject("cosmo");
const { hero } = cosmoCase;

export const metadata: Metadata = projectMetadata(project, cosmoCase.meta);

interface FactProps {
  label: string;
  children: ReactNode;
}

function Fact({ label, children }: FactProps) {
  return (
    <div className="flex flex-col gap-1">
      <Text as="dt" size="label" tone="muted">
        {label}
      </Text>
      <Text as="dd" size="code" tone="fg">
        {children}
      </Text>
    </div>
  );
}

function Facts() {
  const { where, status, role } = hero.facts;
  return (
    <dl aria-label={projectPageContent.factsLabel} className="grid grid-cols-2 gap-x-10 gap-y-4">
      <Fact label={where.label}>{where.value}</Fact>
      <Fact label={status.label}>
        <ProjectStatus status={project.status} />
      </Fact>
      <Fact label={role.label}>{role.value}</Fact>
    </dl>
  );
}

export default function CosmoPage() {
  ensureProjectPage(project);

  return (
    <>
      <SiteHeader homeHref={projectPageContent.homeHref} items={cosmoCase.nav} className="border-b border-line" />
      <main>
        <ProjectHero
          kicker={hero.kicker}
          titleLines={hero.titleLines}
          intro={hero.intro}
          aside={<Facts />}
        />
        <Section tone="sunken" aria-label={cosmoCase.decisions.ariaLabel} className="pt-18">
          <Container>
            <DecisionTour decisions={decisions} />
          </Container>
        </Section>
        <CosmoToday />
      </main>
      <SiteFooter />
    </>
  );
}
