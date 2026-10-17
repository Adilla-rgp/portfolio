import type { ThresholdPoint } from "@/content/threshold";

/** SVG geometry in viewBox units, from the reference chart (680×380). */
export const chartBox = {
  width: 680,
  height: 380,
  plotLeft: 50,
  plotRight: 660,
  plotTop: 30,
  plotBottom: 330,
  /** Rate 1.0 sits at plotTop; rate 0 at plotBottom. */
  rateSpan: 300,
  handleLabelWidth: 76,
  handleLabelHeight: 22,
} as const;

export interface ChartScales {
  minThreshold: number;
  maxThreshold: number;
  x: (threshold: number) => number;
  y: (rate: number) => number;
  thresholdAt: (viewBoxX: number) => number;
}

export function createScales(points: readonly ThresholdPoint[]): ChartScales {
  const thresholds = points.map((point) => point.threshold);
  const minThreshold = Math.min(...thresholds);
  const maxThreshold = Math.max(...thresholds);
  const plotWidth = chartBox.plotRight - chartBox.plotLeft;
  const span = maxThreshold - minThreshold;

  return {
    minThreshold,
    maxThreshold,
    x: (threshold) => chartBox.plotLeft + ((threshold - minThreshold) / span) * plotWidth,
    y: (rate) => chartBox.plotBottom - rate * chartBox.rateSpan,
    thresholdAt: (viewBoxX) =>
      minThreshold + ((viewBoxX - chartBox.plotLeft) / plotWidth) * span,
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
export function areaPath(line: string, scales: ChartScales): string {
  const right = scales.x(scales.maxThreshold);
  const left = scales.x(scales.minThreshold);
  return `${line} L${right} ${chartBox.plotBottom} L${left} ${chartBox.plotBottom} Z`;
}

export function nearestPoint(points: readonly ThresholdPoint[], threshold: number): ThresholdPoint {
  return points.reduce((best, point) =>
    Math.abs(point.threshold - threshold) < Math.abs(best.threshold - threshold) ? point : best,
  );
}

/** Keeps the floating label inside the viewBox at both ends of the axis. */
export function labelX(handleX: number): number {
  const half = chartBox.handleLabelWidth / 2;
  return Math.min(Math.max(handleX - half, 0), chartBox.width - chartBox.handleLabelWidth);
}

/** CSS custom properties that position the handle, its dots and its label. */
export function handleVars(point: ThresholdPoint, scales: ChartScales) {
  const handleX = scales.x(point.threshold);
  return {
    "--handle-x": handleX,
    "--hit-y": scales.y(point.cacheHitRate),
    "--wrong-y": scales.y(point.wrongReuseRate),
    "--label-x": labelX(handleX),
  } as const;
}
