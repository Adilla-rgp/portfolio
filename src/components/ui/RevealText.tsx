import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface RevealTextProps
  extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  /** Each entry is one masked line (up to 5 get a staggered delay). */
  lines: readonly ReactNode[];
}

/**
 * Line-by-line rise, pure CSS (`reveal-line` / `reveal-rise` in utilities.css),
 * so it renders on the server and plays without hydration. Place it inside a
 * `Heading` so the semantics stay on the heading element.
 */
export const RevealText = forwardRef<HTMLSpanElement, RevealTextProps>(
  function RevealText({ lines, className, ...props }, ref) {
    return (
      <span ref={ref} className={cn("block", className)} {...props}>
        {lines.map((line, index) => (
          <span key={index} className="reveal-line">
            <span className="reveal-rise">{line}</span>
          </span>
        ))}
      </span>
    );
  },
);
