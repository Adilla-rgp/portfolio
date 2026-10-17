import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { RevealText } from "@/components/ui/RevealText";
import { Section } from "@/components/ui/Section";
import { Accent } from "@/components/ui/Typography/Accent";
import { Heading } from "@/components/ui/Typography/Heading";
import { Kicker } from "@/components/ui/Typography/Kicker";
import { Text } from "@/components/ui/Typography/Text";
import { aboutContent } from "@/content/about";
import { publicFileExists } from "@/lib/publicFile";

const { hero } = aboutContent;
const [firstLine, lastLine] = hero.titleLines;

/** Rendered size of the round photo, in CSS px (matches `size-35`). */
const PHOTO_SIZE = 140;

function Photo() {
  if (publicFileExists(hero.photo.src)) {
    return (
      <Image
        src={hero.photo.src}
        alt={hero.photo.alt}
        width={PHOTO_SIZE}
        height={PHOTO_SIZE}
        priority
        className="size-35 rounded-pill object-cover"
      />
    );
  }

  return (
    <div className="flex size-35 items-center justify-center rounded-pill border border-dashed border-faint">
      <Text as="span" size="codeSm" tone="muted">
        {hero.photo.placeholder}
      </Text>
    </div>
  );
}

function CvLinks() {
  return (
    <ul aria-label={hero.cv.ariaLabel} className="flex flex-wrap gap-2">
      {hero.cv.files.map((file, index) => {
        const variant = index === 0 ? "signal" : "outline";
        return (
          <li key={file.href}>
            {publicFileExists(file.href) ? (
              <Button as="a" href={file.href} hrefLang={file.lang} download variant={variant}>
                {file.label} {hero.cv.downloadMark}
              </Button>
            ) : (
              <Button disabled variant={variant}>
                {file.label}
                <span className="font-normal normal-case">· {hero.cv.soonHint}</span>
              </Button>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function AboutHero() {
  return (
    <Section spacing="none" bordered={false} aria-label={hero.ariaLabel} className="pt-22 pb-18">
      <Container className="flex flex-wrap items-end gap-12">
        <div className="flex min-w-0 grow basis-160 flex-col gap-7">
          <Kicker>{hero.kicker}</Kicker>
          <Heading as="h1" size="displayPage">
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
          <Text size="lg" className="max-w-160">
            {hero.intro}
          </Text>
        </div>
        <FadeIn delay="sibling" className="flex basis-65 flex-col items-start gap-4">
          <Photo />
          <CvLinks />
        </FadeIn>
      </Container>
    </Section>
  );
}
