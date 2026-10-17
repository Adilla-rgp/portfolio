"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

interface MotionProviderProps {
  children: ReactNode;
}

/** Makes every Framer Motion animation honor `prefers-reduced-motion`. */
export function MotionProvider({ children }: MotionProviderProps) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
