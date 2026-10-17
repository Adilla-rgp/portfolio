import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const statusDotVariants = cva("inline-block size-2 shrink-0 rounded-full", {
  variants: {
    tone: {
      ok: "bg-ok",
      muted: "bg-muted",
    },
    blink: {
      true: "animate-blink",
      false: "",
    },
  },
  defaultVariants: {
    tone: "ok",
    blink: false,
  },
});

export interface StatusDotProps
  extends ComponentPropsWithoutRef<"span">,
    VariantProps<typeof statusDotVariants> {}

/**
 * Decorative by default. Pass `aria-label` when the dot is the only carrier of
 * the status, and it is exposed as an image.
 */
export const StatusDot = forwardRef<HTMLSpanElement, StatusDotProps>(
  function StatusDot(
    { tone, blink, className, "aria-label": ariaLabel, ...props },
    ref,
  ) {
    const isLabelled = Boolean(ariaLabel);
    // Spread first so callers cannot desync role and aria-hidden from the label.
    return (
      <span
        ref={ref}
        className={cn(statusDotVariants({ tone, blink }), className)}
        {...props}
        aria-label={ariaLabel}
        role={isLabelled ? "img" : undefined}
        aria-hidden={isLabelled ? undefined : true}
      />
    );
  },
);
