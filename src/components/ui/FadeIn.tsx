"use client";

import { forwardRef } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { fade, fadeReduced, inViewOnce } from "@/lib/motion";

export interface FadeInProps
  extends Omit<
    HTMLMotionProps<"div">,
    "initial" | "animate" | "whileInView" | "viewport" | "variants" | "custom"
  > {
  /** Seconds, e.g. `stagger.sibling` for a second column. */
  delay?: number;
}

/** `fade` entrance, played once when the block scrolls into view. */
export const FadeIn = forwardRef<HTMLDivElement, FadeInProps>(function FadeIn(
  { delay = 0, ...props },
  ref,
) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={inViewOnce}
      variants={reducedMotion ? fadeReduced : fade}
      custom={reducedMotion ? 0 : delay}
      {...props}
    />
  );
});
