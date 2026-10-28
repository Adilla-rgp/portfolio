import { describe, expect, it } from "vitest";
import {
  formatRate,
  formatThreshold,
  getZoneText,
  thresholdContent,
  thresholdPoints,
  type ThresholdPoint,
} from "@/content/threshold";
import {
  areaPath,
  chartLayouts,
  createScales,
  handleVars,
  linePath,
  nearestPoint,
} from "@/lib/thresholdChart";

const layout = chartLayouts.wide;
const scales = createScales(thresholdPoints, layout);
const first = thresholdPoints[0];
const last = thresholdPoints[thresholdPoints.length - 1];

describe("createScales", () => {
  it("spans the plot area from the lowest to the highest threshold", () => {
    expect(scales.x(first.threshold)).toBe(layout.plotLeft);
    expect(scales.x(last.threshold)).toBeCloseTo(layout.plotRight);
    expect(scales.y(0)).toBe(layout.plotBottom);
    expect(scales.y(1)).toBe(layout.plotTop);
  });

  it("inverts x with thresholdAt", () => {
    expect(scales.thresholdAt(scales.x(0.72))).toBeCloseTo(0.72);
  });
});

describe("linePath and areaPath", () => {
  const line = linePath(thresholdPoints, scales, (point) => point.cacheHitRate);

  it("draws one command per point", () => {
    expect(line.startsWith("M")).toBe(true);
    expect(line.match(/[ML]/g)).toHaveLength(thresholdPoints.length);
  });

  it("closes the area down to the x axis", () => {
    const area = areaPath(line, scales, layout);
    expect(area.startsWith(line)).toBe(true);
    expect(area.endsWith("Z")).toBe(true);
    expect(area).toContain(`${layout.plotBottom}`);
  });
});

describe("nearestPoint", () => {
  it("snaps to the closest sample and clamps outside the range", () => {
    expect(nearestPoint(thresholdPoints, 0.723).threshold).toBe(0.72);
    expect(nearestPoint(thresholdPoints, 0).threshold).toBe(first.threshold);
    expect(nearestPoint(thresholdPoints, 2).threshold).toBe(last.threshold);
  });
});

describe("handleVars", () => {
  it("keeps the floating label inside the viewBox at both ends", () => {
    for (const point of [first, last]) {
      const labelX = handleVars(point, scales, layout)["--label-x"];
      expect(labelX).toBeGreaterThanOrEqual(0);
      expect(labelX + layout.handleLabelWidth).toBeLessThanOrEqual(layout.width);
    }
  });
});

describe("getZoneText", () => {
  const { zones } = thresholdContent;
  const point = (cacheHitRate: number, wrongReuseRate: number): ThresholdPoint => ({
    threshold: 0.7,
    cacheHitRate,
    wrongReuseRate,
  });

  it("checks the zones in order", () => {
    expect(getZoneText(point(0.9, zones.tooEager.wrongAbove + 0.01))).toBe(zones.tooEager.text);
    expect(getZoneText(point(zones.tooSafe.hitBelow - 0.01, 0))).toBe(zones.tooSafe.text);
    expect(getZoneText(point(0.5, 0))).toBe(zones.balanced.text);
  });
});

describe("formatting", () => {
  it("uses pt-BR decimals and whole percentages", () => {
    expect(formatThreshold(0.72)).toBe("0,72");
    expect(formatRate(0.456)).toBe("46%");
  });
});
