import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { RevealText } from "@/components/ui/RevealText";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { Accent } from "@/components/ui/Typography/Accent";
import { Heading } from "@/components/ui/Typography/Heading";
import { gallifreyCase, missionQuestions } from "@/content/cases/gallifrey";
import { projectPageContent } from "@/content/projectPage";
import { ensureProjectPage, getProject, projectMetadata } from "@/lib/projectPage";
import { BackHomeLink } from "@/sections/project/BackHomeLink";
import { ProjectHero } from "@/sections/project/ProjectHero";
import { ProjectStatus } from "@/sections/project/ProjectStatus";
import { MissionPlayer } from "./_components/MissionPlayer";
import { ShipLine } from "./_components/ShipLine";

const project = getProject("gallifrey");
const cosmo = getProject("cosmo");
/** Links to the Cosmo case only once it is published. */
const cosmoHref = cosmo.isPublished ? cosmo.route : null;
const navItems = [
  gallifreyCase.homeNav,
  ...(cosmoHref ? [{ label: gallifreyCase.cosmoNavLabel, href: cosmoHref }] : []),
];
const { hero, mission, ship } = gallifreyCase;
const [firstShipLine, lastShipLine] = ship.titleLines;

export const metadata: Metadata = projectMetadata(project, gallifreyCase.meta);

export default function GallifreyPage() {
  ensureProjectPage(project);

  return (
    <>
      <SiteHeader
        homeHref={projectPageContent.homeHref}
        items={navItems}
        className="border-b border-line"
      />
      <main>
        <ProjectHero
          kicker={
            <>
              {hero.kicker} <ProjectStatus status={project.status} className="tracking-kicker" />
            </>
          }
          titleLines={hero.titleLines}
          intro={hero.intro}
        />
        <Section tone="sunken" aria-label={mission.ariaLabel} className="border-b pt-18 pb-24">
          <Container>
            <MissionPlayer questions={missionQuestions} whyHref={cosmoHref} />
          </Container>
        </Section>
        <Section bordered={false} aria-labelledby="gallifrey-ship-title">
          <Container className="flex flex-col gap-14">
            <Heading id="gallifrey-ship-title">
              <RevealText
                lines={[
                  firstShipLine,
                  <>
                    {lastShipLine}
                    <Accent>.</Accent>
                  </>,
                ]}
              />
            </Heading>
            <ShipLine steps={ship.steps} aria-label={ship.listLabel} />
            <FadeIn className="flex flex-col gap-14">
              <ul className="flex flex-wrap gap-2">
                {ship.tags.map((tag) => (
                  <li key={tag}>
                    <Tag>{tag}</Tag>
                  </li>
                ))}
              </ul>
              <BackHomeLink />
            </FadeIn>
          </Container>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
