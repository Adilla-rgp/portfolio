"use client";

import { useCallback, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Segmented } from "@/components/ui/Segmented";
import { Text } from "@/components/ui/Typography/Text";
import {
  recommendationCase,
  topics,
  trainingSequence,
  type ContextDirection,
} from "@/content/cases/recomendacao";
import { useRafTicker } from "@/hooks/useRafTicker";
import { cn } from "@/lib/cn";
import { maskedPositions, maskingLoop, tokenRole, type TokenRole } from "@/lib/toyRecommender";

const copy = recommendationCase.how;

const labels = trainingSequence.map(
  (id) => topics.find((topic) => topic.id === id)?.label ?? id,
);

const cardVariantByRole = {
  masked: "signal",
  used: "lit",
  ignored: "outline",
} as const satisfies Record<TokenRole, string>;

interface MaskFrame {
  step: number;
  revealed: boolean;
}

/**
 * Training as a game of hide-and-guess: every 1.8s two positions are masked,
 * then revealed. The ticker only sets state when the step or the reveal
 * flips, a few times per loop. Under reduced motion the first step stays put.
 */
export function MaskingDemo() {
  const [direction, setDirection] = useState<ContextDirection>("bi");
  const [frame, setFrame] = useState<MaskFrame>({ step: 0, revealed: false });

  const onFrame = useCallback((t: number) => {
    const step = Math.floor(t / maskingLoop.step);
    const revealed = (t % maskingLoop.step) / maskingLoop.step > maskingLoop.revealAt;
    setFrame((current) =>
      current.step === step && current.revealed === revealed ? current : { step, revealed },
    );
  }, []);

  const { ref } = useRafTicker<HTMLOListElement>({ onFrame });
  const masked = maskedPositions(frame.step, labels.length);
  const bidirectional = direction === "bi";

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Text size="lg" className="max-w-180">
          {bidirectional ? copy.text.bi : copy.text.esquerda}
        </Text>
        <Segmented
          aria-label={copy.directionLabel}
          options={copy.directions}
          value={direction}
          onValueChange={setDirection}
        />
      </div>

      <ol ref={ref} aria-label={copy.sequenceLabel} className="grid grid-cols-4 gap-2 md:grid-cols-8">
        {labels.map((label, position) => {
          const role = tokenRole(position, masked, bidirectional);
          const isHidden = role === "masked" && !frame.revealed;
          return (
            <li key={label}>
              <Card
                variant={cardVariantByRole[role]}
                radius="item"
                padding="none"
                className={cn(
                  "flex h-full min-h-21 flex-col justify-center gap-1 p-3 transition-colors duration-300",
                  role === "ignored" && "border-dashed border-line-strong text-faint",
                )}
              >
                <Text as="span" size="codeXs" tone="inherit" className="opacity-80">
                  {recommendationCase.demo.position(position)}
                </Text>
                <Text as="span" tone="inherit" className="font-bold wrap-anywhere">
                  {isHidden ? recommendationCase.demo.mask : label}
                </Text>
              </Card>
            </li>
          );
        })}
      </ol>

      <ul className="flex flex-wrap gap-6">
        <LegendItem swatch="bg-signal" label={copy.legend.masked} />
        <LegendItem swatch="bg-fg" label={copy.legend.used} />
        <LegendItem swatch="border border-dashed border-faint" label={copy.legend.ignored} />
      </ul>
    </div>
  );
}

function LegendItem({ swatch, label }: { swatch: string; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span aria-hidden="true" className={cn("size-3.5 rounded-chip", swatch)} />
      <Text as="span" size="codeSm" tone="muted">
        {label}
      </Text>
    </li>
  );
}
