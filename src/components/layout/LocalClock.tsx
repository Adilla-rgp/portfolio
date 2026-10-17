"use client";

import { useSyncExternalStore } from "react";

const TICK_MS = 1000;

function subscribe(onTick: () => void) {
  const id = window.setInterval(onTick, TICK_MS);
  return () => window.clearInterval(id);
}

const getServerSnapshot = () => null;

interface LocalClockProps {
  timeZone: string;
  locale: string;
  /** Rendered on the server and before hydration, so markup never mismatches. */
  fallback: string;
}

export function LocalClock({ timeZone, locale, fallback }: LocalClockProps) {
  const formatter = getFormatter(locale, timeZone);
  const time = useSyncExternalStore(
    subscribe,
    () => formatter.format(Date.now()),
    getServerSnapshot,
  );

  return (
    <span className="tabular-nums">
      {time ?? fallback}
    </span>
  );
}

const formatters = new Map<string, Intl.DateTimeFormat>();

// Intl formatters are costly to build; reuse one per locale/zone pair.
function getFormatter(locale: string, timeZone: string) {
  const key = `${locale}|${timeZone}`;
  let formatter = formatters.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    formatters.set(key, formatter);
  }
  return formatter;
}
