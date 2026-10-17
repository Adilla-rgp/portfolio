import type { TimelineEvent } from "@/content/timeline";
import { timelineRange } from "@/content/timeline";
import { clamp01, easeOutCubic } from "@/lib/easing";

/** Autoplay: a 5s sweep after a 0.8s hold, as in About.dc.html. */
export const timelineAutoplay = { delay: 0.8, duration: 5 } as const;

export function autoplayYear(t: number): number {
  const { delay, duration } = timelineAutoplay;
  const { start, autoplayEnd } = timelineRange;
  return start + (autoplayEnd - start) * easeOutCubic(clamp01((t - delay) / duration));
}

/** 0 → 1 along the axis. */
export function yearFraction(year: number): number {
  const { start, end } = timelineRange;
  return clamp01((year - start) / (end - start));
}

/** Index of the last milestone already reached, or -1 before the first. */
export function currentEventIndex(events: readonly TimelineEvent[], year: number): number {
  return events.findLastIndex((event) => event.at <= year);
}
