"use client";

import { useCallback, useRef, useState } from "react";
import { Heading } from "@/components/ui/Typography/Heading";
import { Text } from "@/components/ui/Typography/Text";
import { useRafTicker } from "@/hooks/useRafTicker";
import { clamp01 } from "@/lib/easing";

/** Gallifrey.dc.html: a 5s fill after a 0.8s hold, repeating every 7s. */
const SHIP_LOOP = { delay: 0.8, fill: 5, period: 7 } as const;
const INDEX_DIGITS = 2;

interface ShipStep {
  title: string;
  body: string;
}

interface ShipLineProps {
  steps: readonly ShipStep[];
  "aria-label": string;
}

function loopProgress(t: number): number {
  const elapsed = t - SHIP_LOOP.delay;
  if (elapsed < 0) return 0;
  return clamp01((elapsed % SHIP_LOOP.period) / SHIP_LOOP.fill);
}

/**
 * Road from prototype to production. The fill is written to `--bar` through a
 * ref; React re-renders only when another step is reached. The server (and
 * reduced motion, where the ticker never runs) shows the whole road lit.
 */
export function ShipLine({ steps, "aria-label": ariaLabel }: ShipLineProps) {
  const [reached, setReached] = useState(steps.length - 1);
  const trackRef = useRef<HTMLSpanElement>(null);

  const onFrame = useCallback(
    (t: number) => {
      const progress = loopProgress(t);
      trackRef.current?.style.setProperty("--bar", String(progress));
      setReached(Math.floor(progress * steps.length - Number.EPSILON));
    },
    [steps.length],
  );

  const { ref } = useRafTicker<HTMLOListElement>({ onFrame });

  return (
    <div className="relative pt-8">
      <span ref={trackRef} aria-hidden="true" className="absolute inset-x-0 top-0 h-0.75 bg-line">
        <span className="bar-x absolute inset-y-0 left-0 bg-signal" />
      </span>
      <ol ref={ref} aria-label={ariaLabel} className="grid grid-cols-steps gap-6">
        {steps.map((step, index) => {
          const isOn = index <= reached;
          return (
            <li key={step.title} className="flex flex-col gap-3">
              <Text as="span" size="mono" tone={isOn ? "signal" : "muted"} className="transition-colors duration-300">
                {String(index + 1).padStart(INDEX_DIGITS, "0")}
              </Text>
              <Heading
                as="h3"
                size="node"
                tone={isOn ? "default" : "dim"}
                className="uppercase transition-colors duration-300"
              >
                {step.title}
              </Heading>
              <Text>{step.body}</Text>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
