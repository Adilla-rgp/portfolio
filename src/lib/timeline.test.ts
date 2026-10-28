import { describe, expect, it } from "vitest";
import { timelineContent, timelineEvents, timelineRange } from "@/content/timeline";
import {
  autoplayYear,
  currentEventIndex,
  currentEvents,
  isCurrentEvent,
  timelineAutoplay,
  yearFraction,
} from "@/lib/timeline";

const { start, end, autoplayEnd } = timelineRange;

describe("timelineEvents", () => {
  it("is sorted along the axis and ends before the autoplay stops", () => {
    const positions = timelineEvents.map((event) => event.at);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(Math.min(...positions)).toBeGreaterThanOrEqual(start);
    expect(Math.max(...positions)).toBeLessThanOrEqual(autoplayEnd);
  });
});

describe("yearFraction", () => {
  it("maps the range to 0..1 and clamps outside it", () => {
    expect(yearFraction(start)).toBe(0);
    expect(yearFraction(end)).toBe(1);
    expect(yearFraction((start + end) / 2)).toBe(0.5);
    expect(yearFraction(start - 1)).toBe(0);
    expect(yearFraction(end + 1)).toBe(1);
  });
});

describe("autoplayYear", () => {
  const { delay, duration } = timelineAutoplay;

  it("holds at the start, then stops just after the last milestone", () => {
    expect(autoplayYear(0)).toBe(start);
    expect(autoplayYear(delay)).toBe(start);
    expect(autoplayYear(delay + duration)).toBe(autoplayEnd);
    expect(autoplayYear(delay + duration * 2)).toBe(autoplayEnd);
  });

  it("only moves forward", () => {
    const samples = Array.from({ length: 20 }, (_, index) =>
      autoplayYear((index / 19) * (delay + duration)),
    );
    expect(samples).toEqual([...samples].sort((a, b) => a - b));
  });
});

describe("currentEventIndex", () => {
  it("is -1 before the first milestone", () => {
    expect(currentEventIndex(timelineEvents, start - 1)).toBe(-1);
  });

  it("is the last milestone reached", () => {
    expect(currentEventIndex(timelineEvents, end)).toBe(timelineEvents.length - 1);
  });
});

describe("currentEvents", () => {
  const sharedStart = timelineEvents.find((event, index) =>
    timelineEvents.some((other, otherIndex) => otherIndex !== index && other.at === event.at),
  );

  it("lights milestones that start together", () => {
    expect(sharedStart).toBeDefined();
    const at = sharedStart?.at ?? start;
    const current = currentEvents(timelineEvents, at);
    expect(current.length).toBeGreaterThan(1);
    expect(current.every((event) => event.at === at)).toBe(true);
  });

  it("is empty before the first milestone", () => {
    expect(currentEvents(timelineEvents, start - 1)).toEqual([]);
    expect(isCurrentEvent(timelineEvents, 0, -1)).toBe(false);
  });
});

describe("describeValue", () => {
  it("names every current milestone", () => {
    const [first, second] = timelineEvents;
    expect(timelineContent.describeValue(2024, [first, second])).toBe(
      `2024: ${first.title}, ${second.title}`,
    );
    expect(timelineContent.describeValue(2019, [])).toBe("2019");
  });
});
