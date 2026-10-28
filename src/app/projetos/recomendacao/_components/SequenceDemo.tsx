"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Typography/Heading";
import { Text } from "@/components/ui/Typography/Text";
import { recommendationCase, thematicLinks, topics } from "@/content/cases/recomendacao";
import { cn } from "@/lib/cn";
import { cssVars } from "@/lib/cssVars";
import { buildAffinity, predictNext } from "@/lib/toyRecommender";

const copy = recommendationCase.demo;
const INITIAL_SEQUENCE = [0, 1, 2];
const TOP_PREDICTIONS = 3;
const INDEX_DIGITS = 2;
const PERCENT = 100;

const topicIndex = (id: string) => topics.findIndex((topic) => topic.id === id);
const affinity = buildAffinity(
  topics.length,
  thematicLinks.map(([from, to]) => [topicIndex(from), topicIndex(to)] as const),
);

function percent(value: number): number {
  return Math.round(value * PERCENT);
}

export function SequenceDemo() {
  const [sequence, setSequence] = useState<number[]>(INITIAL_SEQUENCE);
  const { ranked, attention } = useMemo(() => predictNext(sequence, affinity), [sequence]);
  const isFull = sequence.length >= copy.maxLength;
  const maxAttention = Math.max(...attention, 0);
  const predictions = sequence.length > 0 ? ranked.slice(0, TOP_PREDICTIONS) : [];
  const top = predictions[0];

  return (
    <div className="flex flex-col gap-9">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Text as="span" size="label" tone="muted">
            {copy.pickStep}
          </Text>
          <Button variant="outline" onClick={() => setSequence([])}>
            {copy.reset}
          </Button>
        </div>
        <ul aria-label={copy.catalogLabel} className="flex flex-wrap gap-2">
          {topics.map((topic, index) => {
            const isUsed = sequence.includes(index);
            return (
              <li key={topic.id}>
                <Button
                  variant="outline"
                  disabled={isUsed || isFull}
                  onClick={() => setSequence([...sequence, index])}
                  className="bg-surface-2 normal-case"
                >
                  + {topic.label}
                </Button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <Text as="span" size="label" tone="muted">
          {copy.sequenceStep}
        </Text>
        <ol aria-label={copy.sequenceLabel} className="flex flex-wrap items-end gap-2.5">
          {sequence.map((item, position) => {
            const label = topics[item].label;
            const share = attention[position];
            const isFocus = share === maxAttention;
            return (
              <li key={topics[item].id} className="flex w-37 flex-col gap-2">
                <span aria-hidden="true" className="flex h-22.5 items-end">
                  <span
                    style={cssVars({ "--bar": share / maxAttention })}
                    className={cn(
                      "bar-y block min-h-1.5 w-full rounded-t-chip transition-all duration-500 ease-out-expo",
                      isFocus ? "bg-signal" : "bg-faint",
                    )}
                  />
                </span>
                <Button
                  variant="outline"
                  aria-label={copy.remove(label)}
                  onClick={() => setSequence(sequence.filter((_, index) => index !== position))}
                  className="min-h-16 w-full flex-col items-start gap-0.5 rounded-item bg-surface-2 px-3.5 text-left normal-case"
                >
                  <Text as="span" size="codeXs" tone="muted">
                    {copy.position(position)}
                  </Text>
                  <Text as="span" tone="fg" className="font-bold">
                    {label}
                  </Text>
                </Button>
                <Text as="span" size="codeXs" tone="muted">
                  {copy.attention(percent(share))}
                </Text>
              </li>
            );
          })}
          <li aria-hidden="true" className="flex w-37 flex-col gap-2">
            <span className="h-22.5" />
            <Card
              variant="signal"
              radius="item"
              padding="none"
              className="flex min-h-16 animate-glow-pulse flex-col justify-center gap-0.5 px-3.5"
            >
              <Text as="span" size="codeXs" tone="inherit" className="uppercase">
                {copy.nextSlot}
              </Text>
              <Text as="span" size="code" tone="inherit" className="font-bold">
                {copy.mask}
              </Text>
            </Card>
            <Text as="span" size="codeXs" tone="muted">
              {copy.toPredict}
            </Text>
          </li>
        </ol>
      </div>

      <div className="flex flex-col gap-3.5">
        <Text as="span" size="label" tone="muted">
          {copy.predictStep}
        </Text>
        {predictions.length > 0 ? (
          <ol aria-label={copy.predictionsLabel} className="flex flex-col gap-2.5">
            {predictions.map((prediction, rank) => {
              const isTop = rank === 0;
              return (
                <li
                  key={topics[prediction.item].id}
                  className="grid grid-cols-prediction items-center gap-4"
                >
                  <Text as="span" size="code" tone={isTop ? "signal" : "muted"}>
                    {String(rank + 1).padStart(INDEX_DIGITS, "0")}
                  </Text>
                  <Heading
                    as="span"
                    size="node"
                    tone={isTop ? "default" : "dim"}
                    className="truncate"
                  >
                    {topics[prediction.item].label}
                  </Heading>
                  <span aria-hidden="true" className="block h-4.5 overflow-hidden rounded-chip bg-surface-2">
                    <span
                      style={cssVars({ "--bar": prediction.probability })}
                      className={cn(
                        "bar-x block h-full rounded-chip transition-all duration-500 ease-out-expo",
                        isTop ? "bg-signal" : "bg-faint",
                      )}
                    />
                  </span>
                  <Text as="span" size="code" tone="fg" className="text-right">
                    {percent(prediction.probability)}%
                  </Text>
                </li>
              );
            })}
          </ol>
        ) : (
          <Text tone="muted">{copy.empty}</Text>
        )}
        <p className="sr-only" aria-live="polite">
          {top ? copy.describe(topics[top.item].label, percent(top.probability)) : copy.empty}
        </p>
        <Text size="codeSm" tone="muted" className="max-w-160">
          {copy.toyNote}
        </Text>
      </div>
    </div>
  );
}
