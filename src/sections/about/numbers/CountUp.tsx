"use client";

import { useCallback, useRef, useState } from "react";
import { useRafTicker } from "@/hooks/useRafTicker";
import { countUpProgress } from "@/lib/countUp";

interface CountUpProps {
  value: number;
}

/**
 * Counts from 0 to `value` once it scrolls into view. The server renders the
 * final value, which stays when the ticker never runs (no JS, reduced motion);
 * the first frame lands inside the hold and rewinds to 0. The digits are
 * written through a ref, so nothing re-renders per frame. Screen readers get
 * the final value only.
 */
export function CountUp({ value }: CountUpProps) {
  const digitsRef = useRef<HTMLSpanElement>(null);
  const [isDone, setIsDone] = useState(false);

  const write = useCallback(
    (progress: number) => {
      if (digitsRef.current) {
        digitsRef.current.textContent = String(Math.round(value * progress));
      }
    },
    [value],
  );

  const onFrame = useCallback(
    (t: number) => {
      const progress = countUpProgress(t);
      write(progress);
      if (progress >= 1) setIsDone(true);
    },
    [write],
  );

  const { ref } = useRafTicker<HTMLSpanElement>({
    onFrame,
    enabled: !isDone,
  });

  return (
    <span ref={ref}>
      <span className="sr-only">{value}</span>
      <span ref={digitsRef} aria-hidden="true">
        {value}
      </span>
    </span>
  );
}
