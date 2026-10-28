"use client";

import { useCallback, useId, useRef, useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Accent } from "@/components/ui/Typography/Accent";
import { Heading } from "@/components/ui/Typography/Heading";
import { Text } from "@/components/ui/Typography/Text";
import { cosmoCase } from "@/content/cases/cosmo";
import type { Decision } from "@/content/decisions";
import { useRafTicker } from "@/hooks/useRafTicker";
import { cn } from "@/lib/cn";
import { clamp01 } from "@/lib/easing";
import { ArchitectureDiagram, describeLitParts } from "./ArchitectureDiagram";
import { DecisionDetails } from "./DecisionDetails";

/** Case.dc.html: each decision stays on screen for 6s during the tour. */
const TOUR_STEP_SECONDS = 6;
const INDEX_DIGITS = 2;

const copy = cosmoCase.decisions;

function decisionNumber(index: number): string {
  return String(index + 1).padStart(INDEX_DIGITS, "0");
}

interface DecisionTourProps {
  decisions: readonly Decision[];
}

/**
 * Tabs over the decisions, with an automatic tour that advances every 6s.
 * The ticker writes the current tab's progress to `--bar` on the tab list, so the
 * bar fills without re-rendering; React only renders when the decision
 * changes. Picking a tab or the alternative stops the tour. Under reduced
 * motion the tour never starts and its toggle is hidden.
 */
export function DecisionTour({ decisions }: DecisionTourProps) {
  const [index, setIndex] = useState(0);
  const [isTouring, setIsTouring] = useState(true);
  const [showAlternative, setShowAlternative] = useState(false);
  const stepStartRef = useRef<number | null>(null);
  const tablistRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  const onFrame = useCallback(
    (t: number) => {
      stepStartRef.current ??= t;
      const progress = clamp01((t - stepStartRef.current) / TOUR_STEP_SECONDS);
      tablistRef.current?.style.setProperty("--bar", String(progress));
      if (progress < 1) return;
      stepStartRef.current = t;
      setIndex((current) => (current + 1) % decisions.length);
      setShowAlternative(false);
    },
    [decisions.length],
  );

  const { ref: tickerRef, reducedMotion } = useRafTicker<HTMLDivElement>({
    onFrame,
    enabled: isTouring,
  });
  const touring = isTouring && !reducedMotion;

  const select = (next: number) => {
    setIndex(next);
    setShowAlternative(false);
    setIsTouring(false);
  };

  const toggleTour = () => {
    stepStartRef.current = null;
    tablistRef.current?.style.setProperty("--bar", "0");
    setIsTouring(!isTouring);
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = decisions.length - 1;
    const targets: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const next = targets[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next);
    tabsRef.current[next]?.focus();
  };

  const current = decisions[index];
  const number = decisionNumber(index);
  const tabId = (position: number) => `${baseId}-tab-${position}`;
  const panelId = `${baseId}-panel`;

  return (
    <div ref={tickerRef} className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Heading>
          {copy.title}
          <Accent>.</Accent>
        </Heading>
        {!reducedMotion && (
          <Button variant="outline" aria-pressed={touring} onClick={toggleTour}>
            {touring ? copy.tour.pause : copy.tour.play}
          </Button>
        )}
      </div>

      <div
        ref={tablistRef}
        role="tablist"
        aria-label={copy.tabsLabel}
        onKeyDown={onTabKeyDown}
        className="grid grid-cols-5 gap-2"
      >
        {decisions.map((decision, position) => {
          const isCurrent = position === index;
          return (
            <button
              key={decision.id}
              ref={(element) => {
                tabsRef.current[position] = element;
              }}
              id={tabId(position)}
              type="button"
              role="tab"
              aria-selected={isCurrent}
              aria-controls={panelId}
              tabIndex={isCurrent ? 0 : -1}
              onClick={() => select(position)}
              className="flex min-h-11 cursor-pointer flex-col gap-2.5 pb-3.5 text-left sm:min-h-30"
            >
              <span className="relative block h-0.75 w-full bg-line">
                <span
                  className={cn(
                    "absolute inset-y-0 left-0 bg-signal",
                    position < index && "w-full",
                    position > index && "w-0",
                    isCurrent && (touring ? "bar-x" : "w-full"),
                  )}
                />
              </span>
              <Heading
                as="span"
                size="node"
                tone={isCurrent ? "default" : "dim"}
                className="tabular-nums sm:text-stat md:text-number"
              >
                {decisionNumber(position)}
              </Heading>
              <Text
                as="span"
                size="label"
                tone={isCurrent ? "signal" : "muted"}
                className="sr-only sm:not-sr-only"
              >
                {decision.short}
              </Text>
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={panelId} aria-labelledby={tabId(index)} className="flex flex-col gap-10">
        <Card
          variant="sunken"
          padding="none"
          role="img"
          tabIndex={0}
          aria-label={copy.describeDiagram(number, describeLitParts(current.nodes))}
          className="overflow-x-auto bg-bg"
        >
          <Text as="span" size="label" tone="muted" className="block px-6 pt-5">
            {copy.diagramCaption(number)}
          </Text>
          <ArchitectureDiagram lit={current.nodes} />
        </Card>

        <DecisionDetails
          decision={current}
          number={number}
          showAlternative={showAlternative}
          onToggleAlternative={() => {
            setShowAlternative(!showAlternative);
            setIsTouring(false);
          }}
        />
      </div>
    </div>
  );
}
