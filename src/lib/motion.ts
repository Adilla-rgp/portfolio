import type { Transition, Variants } from "framer-motion";

// The title rise (RevealText) lives in CSS so it runs without hydration; see
// `reveal-rise` in src/styles/utilities.css.

/** Mirrors `--ease-out-expo` in src/styles/tokens.css. */
export const easeOutExpo = [0.2, 0.8, 0.2, 1] as const;

export const duration = {
  /** Ceiling for any transition under `prefers-reduced-motion`. */
  reduced: 0.15,
  fade: 0.9,
} as const;

const FADE_OFFSET_PX = 12;

export const reducedTransition: Transition = {
  duration: duration.reduced,
  ease: "linear",
};

/** Gap between sibling entrances, e.g. the two columns of a section. */
export const stagger = {
  sibling: 0.15,
} as const;

/** Section entrances fire once, when a quarter of the block is visible. */
export const inViewOnce = { once: true, amount: 0.25 } as const;

/** Opacity + 12px lift. Pass the delay in seconds as the `custom` prop. */
export const fade: Variants = {
  hidden: { opacity: 0, y: FADE_OFFSET_PX },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: duration.fade, ease: easeOutExpo, delay },
  }),
};

/** Reduced-motion fallback for any entrance: opacity only, ≤150ms. */
export const fadeReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: reducedTransition },
};
