"use client";

import { useId, type PointerEvent } from "react";
import { Text } from "@/components/ui/Typography/Text";
import { cacheContent, cacheSetup, formatSimilarity } from "@/content/cache";
import { cn } from "@/lib/cn";
import { cssVars } from "@/lib/cssVars";

/** The range input works in hundredths so it can use integer steps. */
const RANGE_SCALE = 100;

const { min, max } = cacheSetup.thresholdRange;

function toFraction(value: number): number {
  return Math.min(Math.max((value - min) / (max - min), 0), 1);
}

function fromFraction(fraction: number): number {
  const value = min + Math.min(Math.max(fraction, 0), 1) * (max - min);
  return Math.round(value * RANGE_SCALE) / RANGE_SCALE;
}

interface ThresholdSliderProps {
  threshold: number;
  similarity: number;
  onThresholdChange: (threshold: number) => void;
}

/**
 * Track with the similarity as a fill and the threshold as a draggable handle.
 * The track is decorative; the range input below it is the accessible control
 * and stays in sync.
 */
export function ThresholdSlider({ threshold, similarity, onThresholdChange }: ThresholdSliderProps) {
  const rangeId = useId();
  const passes = similarity >= threshold;

  const dragTo = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    onThresholdChange(fromFraction((event.clientX - rect.left) / rect.width));
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        aria-hidden="true"
        className="relative h-14 cursor-ew-resize touch-none select-none"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          dragTo(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) dragTo(event);
        }}
      >
        <div className="absolute inset-x-0 top-6 h-1.5 rounded-chip bg-line">
          <span
            className={cn(
              "bar-x absolute inset-y-0 left-0 rounded-chip transition-colors duration-150",
              passes ? "bg-signal" : "bg-muted",
            )}
            style={cssVars({ "--bar": toFraction(similarity) })}
          />
        </div>
        <span
          className="at-x absolute top-4.5 h-4 w-0.5 -translate-x-1/2 bg-fg-soft"
          style={cssVars({ "--at": toFraction(cacheSetup.threshold) })}
        />
        <Text
          as="span"
          size="codeXs"
          tone="muted"
          className="at-x absolute top-9.5 -translate-x-1/2 whitespace-nowrap"
          style={cssVars({ "--at": toFraction(cacheSetup.threshold) })}
        >
          {cacheContent.usedThresholdLabel}
        </Text>
        <span
          className="at-x absolute top-3.5 size-5.5 -translate-x-1/2 rounded-pill border-2 border-bg bg-fg"
          style={cssVars({ "--at": toFraction(threshold) })}
        />
      </div>

      <label htmlFor={rangeId} className="flex flex-col gap-2">
        <Text as="span" size="codeSm" tone="muted">
          {cacheContent.thresholdLabel}: {formatSimilarity(threshold)}
        </Text>
        <input
          id={rangeId}
          type="range"
          min={min * RANGE_SCALE}
          max={max * RANGE_SCALE}
          step={1}
          value={Math.round(threshold * RANGE_SCALE)}
          aria-valuetext={cacheContent.describeThreshold(
            formatSimilarity(threshold),
            formatSimilarity(similarity),
          )}
          onChange={(event) => onThresholdChange(Number(event.currentTarget.value) / RANGE_SCALE)}
          className="min-h-8 w-full cursor-pointer accent-signal"
        />
      </label>
      <div aria-hidden="true" className="flex justify-between">
        {[min, max].map((tick) => (
          <Text key={tick} as="span" size="codeXs" tone="muted">
            {formatSimilarity(tick)}
          </Text>
        ))}
      </div>
    </div>
  );
}
