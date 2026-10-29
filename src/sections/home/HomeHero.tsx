import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { RevealText } from "@/components/ui/RevealText";
import { Section } from "@/components/ui/Section";
import { Accent } from "@/components/ui/Typography/Accent";
import { Heading } from "@/components/ui/Typography/Heading";
import { Kicker } from "@/components/ui/Typography/Kicker";
import { Text } from "@/components/ui/Typography/Text";
import { homeContent } from "@/content/home";
import { HeroParticles } from "./hero/HeroParticles";
import { ParticlesControl } from "./hero/ParticlesControl";
import { ReplayButton } from "./hero/ReplayButton";
import { StatusMarquee } from "./StatusMarquee";

const { hero } = homeContent;
const [firstLine, lastLine] = hero.titleLines;

export function HomeHero() {
  return (
    <Section
      spacing="none"
      bordered={false}
      aria-label={hero.ariaLabel}
      className="flex min-h-hero touch-pan-y flex-col overflow-hidden border-b border-line"
    >
      <ParticlesControl>
        <HeroParticles />
        <div className="relative flex flex-1 flex-col">
          <SiteHeader />

          <Container id={hero.id} className="flex flex-col gap-7 pt-14">
            <Kicker>{hero.kicker}</Kicker>
            <Heading as="h1" size="display">
              <RevealText
                lines={[
                  firstLine,
                  <>
                    {lastLine}
                    <Accent>.</Accent>
                  </>,
                ]}
              />
            </Heading>
            <Text size="lg" className="max-w-130 text-halo">
              {hero.intro}
            </Text>
          </Container>

          <Container className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-10 pb-7">
            <Button as="a" href={hero.cta.href} size="lg">
              {hero.cta.label}
            </Button>
            <ReplayButton />
          </Container>

          <StatusMarquee />
        </div>
      </ParticlesControl>
    </Section>
  );
}
