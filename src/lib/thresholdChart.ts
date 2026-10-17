import type { ThresholdPoint } from "@/content/threshold";

/** SVG geometry in viewBox units. */
export interface ChartLayout {
  width: number;
  height: number;
  plotLeft: number;
  plotRight: number;
  plotTop: number;
  plotBottom: number;
  /** Axis text size, in viewBox units. */
  fontSize: number;
  /** Text size of the floating threshold label, in viewBox units. */
  labelFontSize: number;
  axisGutter: number;
  xLabelY: number;
  /** Omitted on the compact layout to save vertical space. */
  xTitleY?: number;
  handleTop: number;
  handleLabelWidth: number;
  handleLabelHeight: number;
  handleLabelBaseline: number;
  dotRadius: { hit: number; wrong: number };
}

export const chartLayouts = {
  /** The reference chart (680×380). */
  wide: {
    width: 680,
    height: 380,
    plotLeft: 50,
    plotRight: 660,
    plotTop: 30,
    plotBottom: 330,
    fontSize: 11,
    labelFontSize: 12,
    axisGutter: 10,
    xLabelY: 356,
    xTitleY: 374,
    handleTop: 22,
    handleLabelWidth: 76,
    handleLabelHeight: 22,
    handleLabelBaseline: 15,
    dotRadius: { hit: 7, wrong: 6 },
  },
  /**
   * Narrow containers (<40rem). A 400-unit viewBox drawn ~320px wide on a 360px
   * phone scales by 0.8, so 15-unit text renders at ≥12px.
   */
  compact: {
    width: 400,
    height: 290,
    plotLeft: 56,
    plotRight: 380,
    plotTop: 40,
    plotBottom: 250,
    fontSize: 15,
    labelFontSize: 16,
    axisGutter: 10,
    xLabelY: 280,
    handleTop: 30,
    handleLabelWidth: 72,
    handleLabelHeight: 28,
    handleLabelBaseline: 19,
    dotRadius: { hit: 8, wrong: 7 },
  },
} as const satisfies Record<string, ChartLayout>;

export type ChartLayoutName = keyof typeof chartLayouts;

export interface ChartScales {
  minThreshold: number;
  maxThreshold: number;
  x: (threshold: number) => number;
  y: (rate: number) => number;
  thresholdAt: (viewBoxX: number) => number;
}

export function createScales(points: readonly ThresholdPoint[], layout: ChartLayout): ChartScales {
  const thresholds = points.map((point) => point.threshold);
  const minThreshold = Math.min(...thresholds);
  const maxThreshold = Math.max(...thresholds);
  const plotWidth = layout.plotRight - layout.plotLeft;
  const plotHeight = layout.plotBottom - layout.plotTop;
  const span = maxThreshold - minThreshold;

  return {
    minThreshold,
    maxThreshold,
    x: (threshold) => layout.plotLeft + ((threshold - minThreshold) / span) * plotWidth,
    y: (rate) => layout.plotBottom - rate * plotHeight,
    thresholdAt: (viewBoxX) => minThreshold + ((viewBoxX - layout.plotLeft) / plotWidth) * span,
  };
}

const COORD_DIGITS = 1;

export function linePath(
  points: readonly ThresholdPoint[],
  scales: ChartScales,
  rate: (point: ThresholdPoint) => number,
): string {
  return points
    .map((point, index) => {
      const command = index === 0 ? "M" : "L";
      return `${command}${scales.x(point.threshold).toFixed(COORD_DIGITS)} ${scales.y(rate(point)).toFixed(COORD_DIGITS)}`;
    })
    .join(" ");
}

/** Closes a line path down to the x axis, for the filled area under it. */
export function areaPath(line: string, scales: ChartScales, layout: ChartLayout): string {
  const right = scales.x(scales.maxThreshold);
  const left = scales.x(scales.minThreshold);
  return `${line} L${right} ${layout.plotBottom} L${left} ${layout.plotBottom} Z`;
}

export function nearestPoint(points: readonly ThresholdPoint[], threshold: number): ThresholdPoint {
  return points.reduce((best, point) =>
    Math.abs(point.threshold - threshold) < Math.abs(best.threshold - threshold) ? point : best,
  );
}

/** Keeps the floating label inside the viewBox at both ends of the axis. */
function labelX(handleX: number, layout: ChartLayout): number {
  const half = layout.handleLabelWidth / 2;
  return Math.min(Math.max(handleX - half, 0), layout.width - layout.handleLabelWidth);
}

/** CSS custom properties that position the handle, its dots and its label. */
export function handleVars(point: ThresholdPoint, scales: ChartScales, layout: ChartLayout) {
  const handleX = scales.x(point.threshold);
  return {
    "--handle-x": handleX,
    "--hit-y": scales.y(point.cacheHitRate),
    "--wrong-y": scales.y(point.wrongReuseRate),
    "--label-x": labelX(handleX, layout),
  } as const;
}
