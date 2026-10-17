"use client";

import { useCallback, useId, useMemo, useRef, type ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/ui/FadeIn";
import { Heading } from "@/components/ui/Typography/Heading";
import { Text } from "@/components/ui/Typography/Text";
import {
  describeRangeValue,
  formatRate,
  formatThreshold,
  getZoneText,
  thresholdContent,
  type ThresholdPoint,
} from "@/content/threshold";
import { nearestPoint, type ChartLayoutName } from "@/lib/thresholdChart";
import { ThresholdSvg, type ThresholdSvgHandle } from "./ThresholdSvg";

/** The range input works in hundredths so it can use integer steps. */
const RANGE_SCALE = 100;

interface ThresholdExplorerProps {
  points: readonly ThresholdPoint[];
  /** Static copy for the left column (kicker, title, body), rendered on the server. */
  intro: ReactNode;
}

/**
 * Explorable threshold chart. Dragging and the range input update the DOM
 * imperatively (CSS variables on each <svg>, textContent on the readouts), so
 * nothing re-renders while the value changes.
 */
export function ThresholdExplorer({ points, intro }: ThresholdExplorerProps) {
  const initial = useMemo(
    () => nearestPoint(points, thresholdContent.defaultThreshold),
    [points],
  );

  const rangeBounds = useMemo(() => {
    const thresholds = points.map((point) => Math.round(point.threshold * RANGE_SCALE));
    return { min: Math.min(...thresholds), max: Math.max(...thresholds) };
  }, [points]);

  const chartsRef = useRef<Partial<Record<ChartLayoutName, ThresholdSvgHandle | null>>>({});
  const rangeRef = useRef<HTMLInputElement>(null);
  const rangeValueRef = useRef<HTMLSpanElement>(null);
  const hitsRef = useRef<HTMLElement>(null);
  const wrongRef = useRef<HTMLElement>(null);
  const zoneRef = useRef<HTMLElement>(null);
  const currentRef = useRef(initial);

  const apply = useCallback(
    (threshold: number) => {
      const point = nearestPoint(points, threshold);
      if (point === currentRef.current) return;
      currentRef.current = point;

      chartsRef.current.compact?.show(point);
      chartsRef.current.wide?.show(point);
      const label = formatThreshold(point.threshold);
      if (rangeValueRef.current) rangeValueRef.current.textContent = label;
      if (rangeRef.current) {
        rangeRef.current.value = String(Math.round(point.threshold * RANGE_SCALE));
        rangeRef.current.setAttribute("aria-valuetext", describeRangeValue(point));
      }
      if (hitsRef.current) hitsRef.current.textContent = formatRate(point.cacheHitRate);
      if (wrongRef.current) wrongRef.current.textContent = formatRate(point.wrongReuseRate);
      if (zoneRef.current) zoneRef.current.textContent = getZoneText(point);
    },
    [points],
  );

  const rangeId = useId();

  return (
    <>
      <FadeIn className="flex min-w-0 grow-10 basis-90 flex-col gap-6">
        {intro}
        <dl className="grid grid-cols-2 gap-4">
          <Card variant="outline" radius="item" padding="sm" className="flex flex-col gap-1.5">
            <Text as="dt" size="label" tone="muted">
              {thresholdContent.stats.hits}
            </Text>
            <Heading as="dd" size="stat" tone="signal" ref={hitsRef}>
              {formatRate(initial.cacheHitRate)}
            </Heading>
          </Card>
          <Card variant="outline" radius="item" padding="sm" className="flex flex-col gap-1.5">
            <Text as="dt" size="label" tone="muted">
              {thresholdContent.stats.wrong}
            </Text>
            <Heading as="dd" size="stat" ref={wrongRef}>
              {formatRate(initial.wrongReuseRate)}
            </Heading>
          </Card>
        </dl>
        <Text size="codeSm" tone="muted" ref={zoneRef}>
          {getZoneText(initial)}
        </Text>
      </FadeIn>

      <FadeIn delay="sibling" className="flex min-w-0 grow-13 basis-140 flex-col gap-4">
        {/* Two layouts, swapped by container width without JS so the first
            paint is already right; both stay in sync through `show`. */}
        <div className="@container">
          <ThresholdSvg
            ref={(handle) => {
              chartsRef.current.compact = handle;
            }}
            layout="compact"
            points={points}
            initial={initial}
            onDrag={apply}
            className="@chart-wide:hidden"
          />
          <ThresholdSvg
            ref={(handle) => {
              chartsRef.current.wide = handle;
            }}
            layout="wide"
            points={points}
            initial={initial}
            onDrag={apply}
            className="hidden @chart-wide:block"
          />
        </div>

        <label htmlFor={rangeId} className="flex flex-col gap-2">
          <Text as="span" size="codeSm" tone="muted">
            {thresholdContent.rangeLabel}: <span ref={rangeValueRef}>{formatThreshold(initial.threshold)}</span>
          </Text>
          <input
            ref={rangeRef}
            id={rangeId}
            type="range"
            min={rangeBounds.min}
            max={rangeBounds.max}
            step={1}
            defaultValue={Math.round(initial.threshold * RANGE_SCALE)}
            aria-valuetext={describeRangeValue(initial)}
            onInput={(event) => apply(Number(event.currentTarget.value) / RANGE_SCALE)}
            className="min-h-8 w-full cursor-pointer accent-signal"
          />
        </label>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Text as="span" size="codeSm" tone="muted" className="flex items-center gap-2">
            <span aria-hidden="true" className="h-0.75 w-4.5 bg-signal" />
            {thresholdContent.legend.hits}
          </Text>
          <Text as="span" size="codeSm" tone="muted" className="flex items-center gap-2">
            <span aria-hidden="true" className="w-4.5 border-t-2 border-dashed border-fg" />
            {thresholdContent.legend.wrong}
          </Text>
          <Text as="span" size="codeSm" tone="muted">
            {thresholdContent.note}
          </Text>
        </div>
      </FadeIn>
    </>
  );
}
