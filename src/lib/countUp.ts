import { clamp01, easeOutCubic } from "@/lib/easing";

/** About numbers: 1.4s count after a 0.6s hold, as in About.dc.html. */
export const countUpTiming = { delay: 0.6, duration: 1.4 } as const;

/** 0 → 1 over the count, from seconds of on-screen time. */
export function countUpProgress(t: number): number {
  const { delay, duration } = countUpTiming;
  return easeOutCubic(clamp01((t - delay) / duration));
}
