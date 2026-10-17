"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";

const DEFAULT_FPS = 30;
const MS_PER_SECOND = 1000;

interface UseRafTickerOptions {
  /** Upper bound on ticks per second. */
  fps?: number;
  enabled?: boolean;
  /**
   * Imperative mode: called every tick with the running time in seconds, and
   * `t` is never stored in state, so nothing re-renders per frame. Use it for
   * canvas drawing. Without it, `t` is exposed as state (keep that component a
   * small leaf).
   */
  onFrame?: (t: number) => void;
}

interface UseRafTickerResult<T extends Element> {
  /** Attach to the animated element; ticking pauses while it is off-screen. */
  ref: RefObject<T | null>;
  /** Seconds of running time (state mode only). Does not advance while paused. */
  t: number;
  isRunning: boolean;
  /** True under `prefers-reduced-motion`; render the settled state instead. */
  reducedMotion: boolean;
}

export function useRafTicker<T extends Element = HTMLElement>({
  fps = DEFAULT_FPS,
  enabled = true,
  onFrame,
}: UseRafTickerOptions = {}): UseRafTickerResult<T> {
  const ref = useRef<T>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const [isVisible, setIsVisible] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [t, setT] = useState(0);
  const elapsedRef = useRef(0);
  const onFrameRef = useRef(onFrame);

  useEffect(() => {
    onFrameRef.current = onFrame;
  }, [onFrame]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => setIsPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const isRunning = enabled && isVisible && isPageVisible && !reducedMotion;

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
        elapsedRef.current += pending / MS_PER_SECOND;
        pending = 0;
        const frame = onFrameRef.current;
        if (frame) frame(elapsedRef.current);
        else setT(elapsedRef.current);
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isRunning, fps]);

  return { ref, t, isRunning, reducedMotion };
}
