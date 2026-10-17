import { forwardRef, type ComponentPropsWithoutRef, type ElementType } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

// Font-stretch has no theme namespace in Tailwind v4, so the width axis is set
// here; size, line-height, tracking and weight come from the --text-* tokens.
// hyphens-auto relies on <html lang="pt-BR"> for the dictionary; it is the
// fallback for words still too wide after the token minimums.
export const headingVariants = cva("font-sans hyphens-auto", {
  variants: {
    tone: {
      default: "text-fg",
      /** Takes the parent color, e.g. inside `Card variant="lit"`. */
      inherit: "text-inherit",
      /** Inactive large items, e.g. collapsed project names. */
      dim: "text-dim",
      signal: "text-signal",
    },
    size: {
      display: "text-display font-stretch-125% uppercase",
      displayXl: "text-display-xl font-stretch-125%",
      h2: "text-h2 font-stretch-115% uppercase",
      h3: "text-h3 font-stretch-115%",
      project: "text-project font-stretch-120% uppercase",
      number: "text-number font-stretch-125% tabular-nums",
      stat: "text-stat font-stretch-115% tabular-nums",
      marquee: "text-marquee font-stretch-125% uppercase",
    },
  },
  defaultVariants: {
    tone: "default",
    size: "h2",
  },
});

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "dd";

export interface HeadingProps
  extends ComponentPropsWithoutRef<"h2">,
    VariantProps<typeof headingVariants> {
  as?: HeadingTag;
}

export const Heading = forwardRef<HTMLElement, HeadingProps>(
  function Heading({ as = "h2", tone, size, className, ...props }, ref) {
    // Widened so one ref type fits every allowed tag.
    const Component = as as ElementType;
    return (
      <Component
        ref={ref}
        className={cn(headingVariants({ tone, size }), className)}
        {...props}
      />
    );
  },
);
