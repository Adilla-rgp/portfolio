import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Typography/Heading";
import { Text } from "@/components/ui/Typography/Text";
import { cosmoCase } from "@/content/cases/cosmo";
import type { Decision } from "@/content/decisions";
import { cn } from "@/lib/cn";

const copy = cosmoCase.decisions;

interface DecisionDetailsProps {
  decision: Decision;
  number: string;
  showAlternative: boolean;
  onToggleAlternative: () => void;
}

/**
 * One decision's text. Optional fields (`alternative`, `result`) that are
 * still null take their label and controls with them, so nothing is left
 * with a heading and no content.
 */
export function DecisionDetails({
  decision,
  number,
  showAlternative,
  onToggleAlternative,
}: DecisionDetailsProps) {
  return (
    <article className="flex flex-wrap items-start gap-12">
      <div className="flex min-w-0 grow basis-105 flex-col gap-5">
        <Text as="span" size="mono" tone="signal">
          {copy.decisionPrefix} {number} · {decision.tag}
        </Text>
        <Heading as="h3" size="h3">
          {decision.title}
        </Heading>
        <Text size="lg">{decision.context}</Text>
      </div>

      <div className="flex min-w-0 grow basis-120 flex-col gap-4">
        <div className={cn("grid gap-3", decision.alternative && "sm:grid-cols-2")}>
          <OptionCard label={copy.chosen} body={decision.choice} isLit={!showAlternative} />
          {decision.alternative && (
            <OptionCard
              label={copy.notChosen}
              body={decision.alternative}
              isLit={showAlternative}
            />
          )}
        </div>
        {decision.alternative && (
          <Button
            variant="outline"
            aria-pressed={showAlternative}
            onClick={onToggleAlternative}
            className="self-start"
          >
            {showAlternative ? copy.flip.hide : copy.flip.show}
          </Button>
        )}
        <dl
          className={cn(
            "grid gap-6 border-t border-line pt-5",
            decision.result && "sm:grid-cols-2",
          )}
        >
          <Detail label={copy.tradeoff} body={decision.tradeoff} />
          {decision.result && <Detail label={copy.result} body={decision.result} />}
        </dl>
      </div>
    </article>
  );
}

interface OptionCardProps {
  label: string;
  body: string;
  isLit: boolean;
}

function OptionCard({ label, body, isLit }: OptionCardProps) {
  return (
    <Card
      variant={isLit ? "lit" : "outline"}
      radius="item"
      className={cn(
        "flex flex-col gap-3 transition-colors duration-300",
        !isLit && "border-dashed border-line-strong text-muted",
      )}
    >
      <Text as="span" size="label" tone="inherit" className="font-bold">
        {label}
      </Text>
      <Text as="span" tone="inherit">
        {body}
      </Text>
    </Card>
  );
}

function Detail({ label, body }: { label: string; body: string }) {
  return (
    <div className="flex flex-col gap-2">
      <Text as="dt" size="label" tone="muted">
        {label}
      </Text>
      <Text as="dd">{body}</Text>
    </div>
  );
}
