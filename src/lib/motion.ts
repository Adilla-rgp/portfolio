import type { Transition, Variants } from "framer-motion";

/** Mirrors `--ease-out-expo` in src/styles/tokens.css. */
export const easeOutExpo = [0.2, 0.8, 0.2, 1] as const;

export const duration = {
  /** Ceiling for any transition under `prefers-reduced-motion`. */
  reduced: 0.15,
  fade: 0.9,
  rise: 1.1,
} as const;

export const stagger = {
  rise: 0.15,
} as const;

const FADE_OFFSET_PX = 12;
const RISE_OFFSET = "105%";

export const reducedTransition: Transition = {
  duration: duration.reduced,
  ease: "linear",
};

/** Opacity + 12px lift. */
export const fade: Variants = {
  hidden: { opacity: 0, y: FADE_OFFSET_PX },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.fade, ease: easeOutExpo },
  },
};

/** Reduced-motion fallback for any entrance: opacity only, ≤150ms. */
export const fadeReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: reducedTransition },
};

/** One RevealText line, sliding up from behind its overflow mask. */
export const rise: Variants = {
  hidden: { y: RISE_OFFSET },
  visible: {
    y: 0,
    transition: { duration: duration.rise, ease: easeOutExpo },
  },
};

export function staggerChildren(
  delayChildren = 0,
  staggerBy: number = stagger.rise,
): Variants {
  return {
    hidden: {},
    visible: { transition: { delayChildren, staggerChildren: staggerBy } },
  };
}
