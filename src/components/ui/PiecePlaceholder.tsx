import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export interface PiecePlaceholderProps extends ComponentPropsWithoutRef<"div"> {
  /** Full placeholder copy from src/content, e.g. `[peça interativa: trace]`. */
  label: string;
}

/**
 * Reserves the final footprint of an interactive piece that has not been built
 * yet. Size it with the same tokens the real piece will use.
 */
export const PiecePlaceholder = forwardRef<HTMLDivElement, PiecePlaceholderProps>(
  function PiecePlaceholder({ label, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center rounded-card border border-dashed border-line-strong p-6 text-center font-mono text-mono-sm uppercase tracking-label text-muted",
          className,
        )}
        {...props}
      >
        {label}
      </div>
    );
  },
);
