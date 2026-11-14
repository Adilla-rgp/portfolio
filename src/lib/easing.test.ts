import { describe, expect, it } from "vitest";
import { clamp01, easeOutCubic } from "@/lib/easing";

describe("clamp01", () => {
  it("keeps values inside [0, 1] unchanged", () => {
    expect(clamp01(0)).toBe(0);
    expect(clamp01(0.4)).toBe(0.4);
    expect(clamp01(1)).toBe(1);
  });

  it("clamps values outside the range to the nearest bound", () => {
    expect(clamp01(-0.5)).toBe(0);
    expect(clamp01(-Infinity)).toBe(0);
    expect(clamp01(1.5)).toBe(1);
    expect(clamp01(Infinity)).toBe(1);
  });
});

describe("easeOutCubic", () => {
  it("starts at 0 and ends at 1", () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
  });

  it("runs ahead of linear progress in between", () => {
    expect(easeOutCubic(0.5)).toBeCloseTo(0.875);
    for (const t of [0.1, 0.25, 0.75, 0.9]) {
      expect(easeOutCubic(t)).toBeGreaterThan(t);
    }
  });

  it("is monotonically increasing", () => {
    const steps = Array.from({ length: 11 }, (_, i) => easeOutCubic(i / 10));
    for (let i = 1; i < steps.length; i++) {
      expect(steps[i]).toBeGreaterThan(steps[i - 1]);
    }
  });
});
