"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";

const DEFAULT_FPS = 30;
const MS_PER_SECOND = 1000;

interface UseRafTickerOptions {
  /** Upper bound on state updates per second. */
  fps?: number;
  enabled?: boolean;
}

interface UseRafTickerResult<T extends Element> {
  /** Attach to the animated element; ticking pauses while it is off-screen. */
  ref: RefObject<T | null>;
  /** Seconds of running time. Does not advance while paused. */
  t: number;
  isRunning: boolean;
  /** True under `prefers-reduced-motion`; render the settled state instead. */
  reducedMotion: boolean;
}

export function useRafTicker<T extends Element = HTMLElement>({
  fps = DEFAULT_FPS,
  enabled = true,
}: UseRafTickerOptions = {}): UseRafTickerResult<T> {
  const ref = useRef<T>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const [isVisible, setIsVisible] = useState(false);
  const [t, setT] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const isRunning = enabled && isVisible && !reducedMotion;

  useEffect(() => {
    if (!isRunning) return;

    const frameInterval = MS_PER_SECOND / fps;
    let frameId = 0;
    let last = performance.now();
    let pending = 0;

    const tick = (now: number) => {
      pending += now - last;
      last = now;

      if (pending >= frameInterval) {
        const elapsed = pending / MS_PER_SECOND;
        pending = 0;
        setT((previous) => previous + elapsed);
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isRunning, fps]);

  return { ref, t, isRunning, reducedMotion };
}
