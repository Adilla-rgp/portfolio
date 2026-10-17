"use client";

import {
  useCallback,
  useId,
  useMemo,
  useRef,
  type PointerEvent,
  type ReactNode,
} from "react";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/ui/FadeIn";
import { Heading } from "@/components/ui/Typography/Heading";
import { Text } from "@/components/ui/Typography/Text";
import {
  describeRangeValue,
  describeThreshold,
  formatRate,
  formatThreshold,
  getZoneText,
  thresholdContent,
  type ThresholdPoint,
} from "@/content/threshold";
import { cssVars } from "@/lib/cssVars";
import {
  areaPath,
  chartBox,
  createScales,
  handleVars,
  linePath,
  nearestPoint,
} from "@/lib/thresholdChart";

/** The range input works in hundredths so it can use integer steps. */
const RANGE_SCALE = 100;
const DASH_PATTERN = "6 5";
const STROKE = { hit: 2.5, wrong: 2, handle: 1.5, grid: 1 } as const;
const DOT_RADIUS = { hit: 7, wrong: 6 } as const;
const LABEL_RADIUS = chartBox.handleLabelHeight / 2;
const LABEL_BASELINE = 15;
const HANDLE_TOP = 22;
const AXIS_GUTTER = 10;
const X_LABEL_Y = 356;
const X_TITLE_Y = 374;
const GRID_RATES = [1, 2 / 3, 1 / 3, 0] as const;

interface ThresholdExplorerProps {
  points: readonly ThresholdPoint[];
  /** Static copy for the left column (kicker, title, body), rendered on the server. */
  intro: ReactNode;
}

/**
 * Explorable threshold chart. Dragging and the range input update the DOM
 * imperatively (CSS variables on the <svg>, textContent on the readouts), so
 * nothing re-renders while the value changes.
 */
export function ThresholdExplorer({ points, intro }: ThresholdExplorerProps) {
  const scales = useMemo(() => createScales(points), [points]);
  const paths = useMemo(() => {
    const hit = linePath(points, scales, (point) => point.cacheHitRate);
    return {
      hit,
      hitArea: areaPath(hit, scales),
      wrong: linePath(points, scales, (point) => point.wrongReuseRate),
    };
  }, [points, scales]);
  const initial = useMemo(
    () => nearestPoint(points, thresholdContent.defaultThreshold),
    [points],
  );

  const svgRef = useRef<SVGSVGElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const labelRef = useRef<SVGTextElement>(null);
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

      const svg = svgRef.current;
      if (svg) {
        for (const [name, value] of Object.entries(handleVars(point, scales))) {
          svg.style.setProperty(name, String(value));
        }
        svg.setAttribute("aria-label", describeThreshold(point));
      }
      const label = formatThreshold(point.threshold);
      if (labelRef.current) labelRef.current.textContent = label;
      if (rangeValueRef.current) rangeValueRef.current.textContent = label;
      if (rangeRef.current) {
        rangeRef.current.value = String(Math.round(point.threshold * RANGE_SCALE));
        rangeRef.current.setAttribute("aria-valuetext", describeRangeValue(point));
      }
      if (hitsRef.current) hitsRef.current.textContent = formatRate(point.cacheHitRate);
      if (wrongRef.current) wrongRef.current.textContent = formatRate(point.wrongReuseRate);
      if (zoneRef.current) zoneRef.current.textContent = getZoneText(point);
    },
    [points, scales],
  );

  const applyFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const viewBoxX = ((event.clientX - rect.left) / rect.width) * chartBox.width;
    apply(scales.thresholdAt(viewBoxX));
  };

  const onPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    applyFromPointer(event);
  };

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) applyFromPointer(event);
  };

  const { plotLeft, plotRight, plotBottom } = chartBox;
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
        <svg
          ref={svgRef}
          viewBox={`0 0 ${chartBox.width} ${chartBox.height}`}
          role="img"
          aria-label={describeThreshold(initial)}
          className="h-auto w-full cursor-ew-resize touch-none select-none"
          style={cssVars(handleVars(initial, scales))}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
        >
          <g className="stroke-line" strokeWidth={STROKE.grid}>
            {GRID_RATES.map((rate) => (
              <line key={rate} x1={plotLeft} x2={plotRight} y1={scales.y(rate)} y2={scales.y(rate)} />
            ))}
          </g>

          <g className="fill-muted font-mono text-mono-xs">
            {thresholdContent.axis.yTicks.map((tick) => (
              <text
                key={tick.label}
                x={plotLeft - AXIS_GUTTER}
                y={scales.y(tick.value)}
                textAnchor="end"
                dominantBaseline="middle"
              >
                {tick.label}
              </text>
            ))}
            <text x={plotLeft} y={X_LABEL_Y}>
              {formatThreshold(scales.minThreshold)}
            </text>
            <text x={plotRight} y={X_LABEL_Y} textAnchor="end">
              {formatThreshold(scales.maxThreshold)}
            </text>
            <text x={(plotLeft + plotRight) / 2} y={X_TITLE_Y} textAnchor="middle">
              {thresholdContent.axis.xTitle}
            </text>
          </g>

          <path d={paths.hitArea} className="fill-signal/12" />
          <path d={paths.hit} fill="none" className="stroke-signal" strokeWidth={STROKE.hit} />
          <path
            d={paths.wrong}
            fill="none"
            className="stroke-fg"
            strokeWidth={STROKE.wrong}
            strokeDasharray={DASH_PATTERN}
          />

          <line
            className="chart-at-handle stroke-fg"
            x1={0}
            x2={0}
            y1={HANDLE_TOP}
            y2={plotBottom}
            strokeWidth={STROKE.handle}
          />
          <circle className="chart-at-hit fill-signal" r={DOT_RADIUS.hit} />
          <circle
            className="chart-at-wrong fill-sunken stroke-fg"
            r={DOT_RADIUS.wrong}
            strokeWidth={STROKE.wrong}
          />
          <g className="chart-at-label">
            <rect
              className="fill-fg"
              width={chartBox.handleLabelWidth}
              height={chartBox.handleLabelHeight}
              rx={LABEL_RADIUS}
            />
            <text
              ref={labelRef}
              x={chartBox.handleLabelWidth / 2}
              y={LABEL_BASELINE}
              textAnchor="middle"
              className="fill-bg font-mono text-mono-sm font-bold"
            >
              {formatThreshold(initial.threshold)}
            </text>
          </g>
        </svg>

        <label htmlFor={rangeId} className="flex flex-col gap-2">
          <Text as="span" size="codeSm" tone="muted">
            {thresholdContent.rangeLabel}: <span ref={rangeValueRef}>{formatThreshold(initial.threshold)}</span>
          </Text>
          <input
            ref={rangeRef}
            id={rangeId}
            type="range"
            min={Math.round(scales.minThreshold * RANGE_SCALE)}
            max={Math.round(scales.maxThreshold * RANGE_SCALE)}
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
