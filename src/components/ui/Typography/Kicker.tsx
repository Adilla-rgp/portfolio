import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export type KickerProps = ComponentPropsWithoutRef<"p">;

/** Section eyebrow, e.g. `01 — O SISTEMA`. */
export const Kicker = forwardRef<HTMLParagraphElement, KickerProps>(
  function Kicker({ className, ...props }, ref) {
    return (
      <p
        ref={ref}
        className={cn(
          "font-mono text-mono uppercase tracking-kicker text-signal",
          className,
        )}
        {...props}
      />
    );
  },
);
