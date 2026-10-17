"use client";

import { useCallback, useId, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Typography/Heading";
import { Text } from "@/components/ui/Typography/Text";
import { useRafTicker } from "@/hooks/useRafTicker";
import {
  timelineContent,
  timelineRange,
  type TimelineEvent,
} from "@/content/timeline";
import { cn } from "@/lib/cn";
import { cssVars } from "@/lib/cssVars";
import {
  autoplayYear,
  currentEventIndex,
  timelineAutoplay,
  yearFraction,
} from "@/lib/timeline";

interface TimelineExplorerProps {
  events: readonly TimelineEvent[];
}

type EventState = "past" | "current" | "future";

const cardVariantByState = {
  past: "surface",
  current: "lit",
  future: "outline",
} as const;

function eventState(index: number, current: number): EventState {
  if (index === current) return "current";
  return index < current ? "past" : "future";
}

const AUTOPLAY_END_T = timelineAutoplay.delay + timelineAutoplay.duration;

/**
 * Milestones from 2020 to 2028. Plays once when it scrolls into view, then the
 * range input takes over. The year readouts, the bar and the input are written
 * through refs; React only re-renders when the current milestone changes.
 * The server renders the final state, which is also what reduced motion gets
 * (the ticker never runs). With motion, the first frame lands inside the
 * autoplay hold, which rewinds everything to the start.
 */
export function TimelineExplorer({ events }: TimelineExplorerProps) {
  const { start, end, autoplayEnd, step, ticks } = timelineRange;
  const [current, setCurrent] = useState(() => currentEventIndex(events, autoplayEnd));
  const [isAutoplaying, setIsAutoplaying] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLParagraphElement>(null);
  const rangeValueRef = useRef<HTMLSpanElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const rangeId = useId();

  const apply = useCallback(
    (year: number) => {
      const label = String(Math.floor(year));
      const index = currentEventIndex(events, year);
      rootRef.current?.style.setProperty("--progress", String(yearFraction(year)));
      if (yearRef.current) yearRef.current.textContent = label;
      if (rangeValueRef.current) rangeValueRef.current.textContent = label;
      if (rangeRef.current) {
        if (document.activeElement !== rangeRef.current) rangeRef.current.value = String(year);
        rangeRef.current.setAttribute(
          "aria-valuetext",
          timelineContent.describeValue(Math.floor(year), events[index]),
        );
      }
      setCurrent(index);
    },
    [events],
  );

  const onFrame = useCallback(
    (t: number) => {
      apply(autoplayYear(t));
      if (t >= AUTOPLAY_END_T) setIsAutoplaying(false);
    },
    [apply],
  );

  const { ref: tickerRef } = useRafTicker<HTMLOListElement>({
    onFrame,
    enabled: isAutoplaying,
  });

  const initialLabel = String(Math.floor(autoplayEnd));

  return (
    <div
      ref={rootRef}
      className="flex flex-col gap-12"
      style={cssVars({ "--progress": yearFraction(autoplayEnd) })}
    >
      <div className="flex flex-col gap-3.5">
        <Heading as="p" size="number" tone="signal" aria-hidden="true" ref={yearRef} className="self-end">
          {initialLabel}
        </Heading>
        <div className="relative h-1 rounded-chip bg-line">
          <span className="timeline-fill absolute inset-y-0 left-0 rounded-chip bg-signal" />
        </div>
        <label htmlFor={rangeId} className="flex flex-col gap-2">
          <Text as="span" size="codeSm" tone="muted">
            {timelineContent.rangeLabel}: <span ref={rangeValueRef}>{initialLabel}</span>
          </Text>
          <input
            ref={rangeRef}
            id={rangeId}
            type="range"
            min={start}
            max={end}
            step={step}
            defaultValue={autoplayEnd}
            aria-valuetext={timelineContent.describeValue(
              Math.floor(autoplayEnd),
              events[currentEventIndex(events, autoplayEnd)],
            )}
            onInput={(event) => {
              setIsAutoplaying(false);
              apply(Number(event.currentTarget.value));
            }}
            className="min-h-8 w-full cursor-pointer accent-signal"
          />
        </label>
        <div aria-hidden="true" className="flex justify-between">
          {ticks.map((tick) => (
            <Text key={tick} as="span" size="codeSm" tone="muted">
              {tick}
            </Text>
          ))}
        </div>
      </div>

      <ol
        ref={tickerRef}
        aria-label={timelineContent.listLabel}
        className="grid grid-cols-timeline gap-3"
      >
        {events.map((event, index) => {
          const state = eventState(index, current);
          return (
            <li key={event.title} aria-current={state === "current" ? "step" : undefined}>
              <Card
                variant={cardVariantByState[state]}
                radius="item"
                padding="sm"
                className={cn(
                  "flex h-full flex-col gap-2 transition-[background-color,color,border-color,transform] duration-300",
                  state === "current" && "-translate-y-1",
                  state === "future" && "border-dashed border-line-strong",
                )}
              >
                <Text
                  as="span"
                  size="label"
                  tone={state === "past" ? "signal" : state === "current" ? "inherit" : "muted"}
                >
                  {event.when}
                </Text>
                <Heading as="h3" size="node" tone={state === "future" ? "dim" : "inherit"}>
                  {event.title}
                </Heading>
                <Text tone={state === "current" ? "inherit" : state === "future" ? "muted" : "soft"}>
                  {event.body}
                </Text>
              </Card>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
