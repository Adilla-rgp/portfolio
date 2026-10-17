import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

// Always pauses on hover and focus: moving content must be pausable (WCAG 2.2.2).
export const marqueeTrackVariants = cva(
  "flex w-max group-hover:animation-paused group-focus-within:animation-paused motion-reduce:animate-none",
  {
    variants: {
      speed: {
        default: "animate-marquee",
        fast: "animate-marquee-fast",
      },
    },
    defaultVariants: {
      speed: "default",
    },
  },
);

export interface MarqueeProps
  extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof marqueeTrackVariants> {
  /** Classes for each of the two copies (gap, padding, typography). */
  itemClassName?: string;
}

/**
 * Infinite strip. Content is rendered twice and the track slides by -50%, so
 * the loop is seamless. The copy is hidden from assistive tech and made inert
 * so links inside it are not tabbable twice. Give it an `aria-label`.
 */
export const Marquee = forwardRef<HTMLDivElement, MarqueeProps>(function Marquee(
  { speed, itemClassName, className, children, ...props },
  ref,
) {
  const copyClassName = cn("flex shrink-0 gap-12 whitespace-nowrap px-6", itemClassName);

  return (
    <div
      ref={ref}
      role="marquee"
      className={cn("group overflow-hidden", className)}
      {...props}
    >
      <div className={marqueeTrackVariants({ speed })}>
        <div className={copyClassName}>{children}</div>
        <div className={copyClassName} aria-hidden="true" inert>
          {children}
        </div>
      </div>
    </div>
  );
});
