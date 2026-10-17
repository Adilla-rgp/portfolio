"use client";

import { forwardRef, type ReactNode } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { fadeReduced, rise, staggerChildren } from "@/lib/motion";
import { cn } from "@/lib/cn";

const DEFAULT_DELAY_S = 0.15;

export interface RevealTextProps
  extends Omit<
    HTMLMotionProps<"span">,
    "children" | "ref" | "initial" | "animate" | "variants"
  > {
  /** Each entry is one masked line. */
  lines: readonly ReactNode[];
  /** Seconds before the first line starts rising. */
  delay?: number;
}

/**
 * Line-by-line reveal. Place inside a `Heading` so the semantics stay on the
 * heading element; this only renders spans.
 */
export const RevealText = forwardRef<HTMLSpanElement, RevealTextProps>(
  function RevealText({ lines, delay = DEFAULT_DELAY_S, className, ...props }, ref) {
    const reducedMotion = useReducedMotion();
    const lineVariants = reducedMotion ? fadeReduced : rise;

    return (
      <motion.span
        ref={ref}
        className={cn("block", className)}
        initial="hidden"
        animate="visible"
        variants={staggerChildren(reducedMotion ? 0 : delay)}
        {...props}
      >
        {lines.map((line, index) => (
          <span key={index} className="reveal-line">
            <motion.span className="block" variants={lineVariants}>
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    );
  },
);
