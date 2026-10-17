import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Typography/Heading";
import { Kicker } from "@/components/ui/Typography/Kicker";
import { Text } from "@/components/ui/Typography/Text";

// Placeholder until roadmap step 3 (static Home).
export default function Home() {
  return (
    <Section bordered={false}>
      <Container className="flex flex-col gap-6">
        <Kicker>Em construção</Kicker>
        <Heading as="h1" size="display">
          Do ruído
          <br />
          ao sistema<span className="text-signal">.</span>
        </Heading>
        <Text size="lg">A Home chega na etapa 3 do roteiro.</Text>
      </Container>
    </Section>
  );
}
