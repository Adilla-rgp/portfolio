import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Marquee } from "@/components/ui/Marquee";
import { Section } from "@/components/ui/Section";
import { StatusDot } from "@/components/ui/StatusDot";
import { Tag } from "@/components/ui/Tag";
import { Heading } from "@/components/ui/Typography/Heading";
import { Kicker } from "@/components/ui/Typography/Kicker";
import { Text } from "@/components/ui/Typography/Text";
import { cn } from "@/lib/cn";
import { DemoBlock } from "./_components/DemoBlock";
import { RevealDemo } from "./_components/RevealDemo";
import { SegmentedDemo } from "./_components/SegmentedDemo";
import { TickerDemo } from "./_components/TickerDemo";

export const metadata: Metadata = {
  title: "UI",
  robots: { index: false, follow: false },
};

// Class names must stay literal so Tailwind can detect them.
const swatches = [
  { name: "bg", className: "bg-bg" },
  { name: "sunken", className: "bg-sunken" },
  { name: "surface", className: "bg-surface" },
  { name: "surface-2", className: "bg-surface-2" },
  { name: "raised", className: "bg-raised" },
  { name: "line", className: "bg-line" },
  { name: "line-strong", className: "bg-line-strong" },
  { name: "fg", className: "bg-fg" },
  { name: "fg-soft", className: "bg-fg-soft" },
  { name: "muted", className: "bg-muted" },
  { name: "dim", className: "bg-dim" },
  { name: "faint", className: "bg-faint" },
  { name: "signal", className: "bg-signal" },
  { name: "ok", className: "bg-ok" },
] as const;

const statusItems = [
  "API ONLINE",
  "SÃO LUÍS [HH:MM]",
  "P95 [— MS]",
  "DEPLOY [SHA]",
  "COSMO · EM PRODUÇÃO",
  "GALLIFREY · EM PRODUÇÃO",
] as const;

export default function UiPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main>
      <Section bordered={false}>
        <Container className="flex flex-col gap-6">
          <Kicker>00 — Dev</Kicker>
          <Heading as="h1">
            Primitivas<span className="text-signal">.</span>
          </Heading>
          <Text size="lg" className="max-w-xl">
            Catálogo de tokens e componentes de src/components/ui. Só existe em
            desenvolvimento.
          </Text>
        </Container>
      </Section>

      <Section tone="sunken" id="tokens">
        <Container className="flex flex-col gap-12">
          <Kicker>01 — Tokens</Kicker>
          <DemoBlock title="Cores">
            <ul className="flex flex-wrap gap-4">
              {swatches.map((swatch) => (
                <li key={swatch.name} className="flex flex-1 basis-32 flex-col gap-2">
                  <span className={cn("h-16 rounded-item border border-line", swatch.className)} />
                  <Text as="span" tone="muted" className="font-mono text-mono-sm">
                    {swatch.name}
                  </Text>
                </li>
              ))}
            </ul>
          </DemoBlock>
        </Container>
      </Section>

      <Section id="tipografia">
        <Container className="flex flex-col gap-12">
          <Kicker>02 — Tipografia</Kicker>
          <DemoBlock title="Heading size=display">
            <Heading as="p" size="display">
              Do ruído<span className="text-signal">.</span>
            </Heading>
          </DemoBlock>
          <DemoBlock title="Heading size=displayXl">
            <Heading as="p" size="displayXl">
              Cosmo<span className="text-signal">.</span>
            </Heading>
          </DemoBlock>
          <DemoBlock title="Heading size=h2 (padrão)">
            <Heading>
              Esta página, por dentro<span className="text-signal">.</span>
            </Heading>
          </DemoBlock>
          <DemoBlock title="Heading size=h3">
            <Heading as="h3" size="h3">
              Arraste o limiar
            </Heading>
          </DemoBlock>
          <DemoBlock title="Heading size=project / number">
            <Heading as="p" size="project">
              Documento → Sinal
            </Heading>
            <Heading as="p" size="project" className="text-dim">
              Gallifrey
            </Heading>
            <Heading as="p" size="number">
              [—%]
            </Heading>
          </DemoBlock>
          <DemoBlock title="Text size=lg / body · tone=soft / muted">
            <Text size="lg" className="max-w-xl">
              Construo os sistemas por trás de produtos com IA: APIs, filas,
              bancos e agentes em produção.
            </Text>
            <Text className="max-w-xl">
              Levo modelos e dados do notebook para produção, sempre com uma
              forma de medir se funcionam.
            </Text>
            <Text tone="muted" className="max-w-xl">
              Curvas ilustrativas, não medidas reais.
            </Text>
          </DemoBlock>
          <DemoBlock title="Kicker">
            <Kicker>01 — O sistema</Kicker>
          </DemoBlock>
        </Container>
      </Section>

      <Section tone="sunken" id="controles">
        <Container className="flex flex-col gap-12">
          <Kicker>03 — Controles</Kicker>
          <DemoBlock title="Button variant × size">
            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg">▶ Disparar GET /home</Button>
              <Button>Signal md</Button>
              <Button variant="outline">↺ Voltar ao ruído</Button>
              <Button variant="outline" size="lg">
                Outline lg
              </Button>
              <Button variant="ghost">Ghost</Button>
              <Button as="a" href="#movimento" size="lg">
                Ver o trabalho ↓
              </Button>
              <Button disabled>Desativado</Button>
            </div>
          </DemoBlock>
          <DemoBlock title="Segmented">
            <SegmentedDemo />
          </DemoBlock>
          <DemoBlock title="Tag · StatusDot">
            <div className="flex flex-wrap items-center gap-3">
              <Tag>FastAPI</Tag>
              <Tag>Postgres</Tag>
              <Tag>Redis</Tag>
              <Tag tone="signal">Lente /backend</Tag>
              <Tag>
                <StatusDot blink /> Em produção
              </Tag>
              <Tag>
                <StatusDot tone="muted" /> Em avaliação
              </Tag>
              <StatusDot blink aria-label="API online" />
            </div>
          </DemoBlock>
        </Container>
      </Section>

      <Section id="superficies">
        <Container className="flex flex-col gap-12">
          <Kicker>04 — Superfícies</Kicker>
          <DemoBlock title="Card variant">
            <div className="flex flex-wrap gap-6">
              <Card className="flex flex-1 basis-72 flex-col gap-3">
                <Text tone="muted" className="font-mono text-mono-sm">
                  surface
                </Text>
                <Text>Painel padrão, borda line.</Text>
              </Card>
              <Card variant="sunken" className="flex flex-1 basis-72 flex-col gap-3">
                <Text tone="muted" className="font-mono text-mono-sm">
                  sunken
                </Text>
                <Text>Painel rebaixado.</Text>
              </Card>
              <Card variant="lit" className="flex flex-1 basis-72 flex-col gap-3">
                <Text tone="inherit" className="font-mono text-mono-sm">
                  lit
                </Text>
                <Text tone="inherit">Item atual, invertido.</Text>
              </Card>
            </div>
          </DemoBlock>
        </Container>
      </Section>

      <Section tone="sunken" id="movimento">
        <Container className="flex flex-col gap-12">
          <Kicker>05 — Movimento</Kicker>
          <DemoBlock title="RevealText">
            <RevealDemo />
          </DemoBlock>
          <DemoBlock title="useRafTicker">
            <TickerDemo />
          </DemoBlock>
        </Container>
        <div className="mt-12 flex flex-col gap-6">
          <Marquee
            aria-label="Status ao vivo"
            className="border-y border-line bg-bg"
            itemClassName="py-3.5 font-mono text-mono uppercase tracking-label text-fg-soft"
          >
            {statusItems.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </Marquee>
          <Marquee speed="fast" itemClassName="gap-16">
            <Heading as="span" size="displayXl" className="uppercase">
              Vamos conversar <span className="text-signal">→</span>
            </Heading>
          </Marquee>
        </div>
      </Section>
    </main>
  );
}
