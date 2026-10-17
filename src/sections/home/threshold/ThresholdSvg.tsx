"use client";

import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  type PointerEvent,
} from "react";
import {
  describeThreshold,
  formatThreshold,
  thresholdContent,
  type ThresholdPoint,
} from "@/content/threshold";
import { cn } from "@/lib/cn";
import { cssVars } from "@/lib/cssVars";
import {
  areaPath,
  chartLayouts,
  createScales,
  handleVars,
  linePath,
  type ChartLayoutName,
} from "@/lib/thresholdChart";

const DASH_PATTERN = "6 5";
const STROKE = { hit: 2.5, wrong: 2, handle: 1.5, grid: 1 } as const;
const GRID_RATES = [1, 2 / 3, 1 / 3, 0] as const;

export interface ThresholdSvgHandle {
  /** Moves the handle and relabels the chart without a React render. */
  show: (point: ThresholdPoint) => void;
}

interface ThresholdSvgProps {
  layout: ChartLayoutName;
  points: readonly ThresholdPoint[];
  initial: ThresholdPoint;
  /** Called with the threshold under the pointer while dragging. */
  onDrag: (threshold: number) => void;
  className?: string;
}

export const ThresholdSvg = forwardRef<ThresholdSvgHandle, ThresholdSvgProps>(
  function ThresholdSvg({ layout: layoutName, points, initial, onDrag, className }, ref) {
    const layout = chartLayouts[layoutName];
    const scales = useMemo(() => createScales(points, layout), [points, layout]);
    const paths = useMemo(() => {
      const hit = linePath(points, scales, (point) => point.cacheHitRate);
      return {
        hit,
        hitArea: areaPath(hit, scales, layout),
        wrong: linePath(points, scales, (point) => point.wrongReuseRate),
      };
    }, [points, scales, layout]);

    const svgRef = useRef<SVGSVGElement>(null);
    const labelRef = useRef<SVGTextElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        show(point) {
          const svg = svgRef.current;
          if (svg) {
            for (const [name, value] of Object.entries(handleVars(point, scales, layout))) {
              svg.style.setProperty(name, String(value));
            }
            svg.setAttribute("aria-label", describeThreshold(point));
          }
          if (labelRef.current) labelRef.current.textContent = formatThreshold(point.threshold);
        },
      }),
      [scales, layout],
    );

    const dragTo = (event: PointerEvent<SVGSVGElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const viewBoxX = ((event.clientX - rect.left) / rect.width) * layout.width;
      onDrag(scales.thresholdAt(viewBoxX));
    };

    const xTicks =
      layoutName === "compact"
        ? thresholdContent.axis.compactXTicks
        : [scales.minThreshold, scales.maxThreshold];
    const lastTick = xTicks.length - 1;
    const { plotLeft, plotRight, plotBottom } = layout;

    return (
      <svg
        ref={svgRef}
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        role="img"
        aria-label={describeThreshold(initial)}
        className={cn("h-auto w-full cursor-ew-resize touch-none select-none", className)}
        style={cssVars(handleVars(initial, scales, layout))}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          dragTo(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) dragTo(event);
        }}
      >
        <g className="stroke-line" strokeWidth={STROKE.grid}>
          {GRID_RATES.map((rate) => (
            <line key={rate} x1={plotLeft} x2={plotRight} y1={scales.y(rate)} y2={scales.y(rate)} />
          ))}
        </g>

        <g className="fill-muted font-mono" fontSize={layout.fontSize}>
          {thresholdContent.axis.yTicks.map((tick) => (
            <text
              key={tick.label}
              x={plotLeft - layout.axisGutter}
              y={scales.y(tick.value)}
              textAnchor="end"
              dominantBaseline="middle"
            >
              {tick.label}
            </text>
          ))}
          {xTicks.map((threshold, index) => (
            <text
              key={threshold}
              x={scales.x(threshold)}
              y={layout.xLabelY}
              textAnchor={index === 0 ? "start" : index === lastTick ? "end" : "middle"}
            >
              {formatThreshold(threshold)}
            </text>
          ))}
          {"xTitleY" in layout && (
            <text x={(plotLeft + plotRight) / 2} y={layout.xTitleY} textAnchor="middle">
              {thresholdContent.axis.xTitle}
            </text>
          )}
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
          y1={layout.handleTop}
          y2={plotBottom}
          strokeWidth={STROKE.handle}
        />
        <circle className="chart-at-hit fill-signal" r={layout.dotRadius.hit} />
        <circle
          className="chart-at-wrong fill-sunken stroke-fg"
          r={layout.dotRadius.wrong}
          strokeWidth={STROKE.wrong}
        />
        <g className="chart-at-label">
          <rect
            className="fill-fg"
            width={layout.handleLabelWidth}
            height={layout.handleLabelHeight}
            rx={layout.handleLabelHeight / 2}
          />
          <text
            ref={labelRef}
            x={layout.handleLabelWidth / 2}
            y={layout.handleLabelBaseline}
            textAnchor="middle"
            fontSize={layout.labelFontSize}
            className="fill-bg font-mono font-bold"
          >
            {formatThreshold(initial.threshold)}
          </text>
        </g>
      </svg>
    );
  },
);
