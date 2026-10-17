import type { Transition } from "framer-motion";

// Framer Motion settings for interaction transitions. Entrances (RevealText,
// FadeIn) are CSS so they never depend on hydration; see utilities.css.

/** Mirrors `--ease-out-expo` in src/styles/tokens.css. */
export const easeOutExpo = [0.2, 0.8, 0.2, 1] as const;

export const duration = {
  /** Ceiling for any transition under `prefers-reduced-motion`. */
  reduced: 0.15,
} as const;

export const reducedTransition: Transition = {
  duration: duration.reduced,
  ease: "linear",
};
