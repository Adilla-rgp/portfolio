import { describe, expect, it } from "vitest";
import { countUpProgress, countUpTiming } from "@/lib/countUp";

const { delay, duration } = countUpTiming;

describe("countUpProgress", () => {
  it("stays at 0 before and during the hold", () => {
    expect(countUpProgress(-1)).toBe(0);
    expect(countUpProgress(0)).toBe(0);
    expect(countUpProgress(delay)).toBe(0);
  });

  it("reaches 1 at the end of the count and stays there", () => {
    expect(countUpProgress(delay + duration)).toBe(1);
    expect(countUpProgress(delay + duration * 10)).toBe(1);
  });

  it("eases out: past the linear midpoint halfway through", () => {
    expect(countUpProgress(delay + duration / 2)).toBeCloseTo(0.875);
  });

  it("never decreases over time", () => {
    const steps = 50;
    const samples = Array.from({ length: steps + 1 }, (_, i) =>
      countUpProgress(((delay + duration) * i) / steps),
    );
    samples.slice(1).forEach((value, i) => expect(value).toBeGreaterThanOrEqual(samples[i]));
  });
});
