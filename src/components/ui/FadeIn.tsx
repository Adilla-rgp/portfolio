"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/** Fires once a quarter of the block is on screen. */
const IN_VIEW_THRESHOLD = 0.25;

export const fadeInVariants = cva("fade-in", {
  variants: {
    delay: {
      none: "",
      /** Second column of a section, `--stagger-sibling` after the first. */
      sibling: "fade-in-sibling",
    },
  },
  defaultVariants: {
    delay: "none",
  },
});

export interface FadeInProps
  extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof fadeInVariants> {}

/**
 * CSS `fade` entrance, played once when the block scrolls into view. The
 * content is never hidden without JS or under reduced motion (see `fade-in` in
 * utilities.css).
 */
export const FadeIn = forwardRef<HTMLDivElement, FadeInProps>(function FadeIn(
  { delay, className, ...props },
  forwardedRef,
) {
  const localRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      localRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef],
  );

  useEffect(() => {
    const element = localRef.current;
    if (!element || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: IN_VIEW_THRESHOLD },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <div
      ref={ref}
      className={cn(fadeInVariants({ delay }), isVisible && "fade-in-visible", className)}
      {...props}
    />
  );
});
