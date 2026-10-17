import { forwardRef, type ComponentPropsWithoutRef, type ElementType } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const textVariants = cva("font-sans", {
  variants: {
    tone: {
      soft: "text-fg-soft",
      muted: "text-muted",
      fg: "text-fg",
      signal: "text-signal",
      /** Takes the parent color, e.g. inside `Card variant="lit"`. */
      inherit: "text-inherit",
    },
    size: {
      body: "text-body",
      lg: "text-body-lg",
      /** Mono labels (DESIGN.md "Label"). */
      label: "font-mono text-mono-sm uppercase tracking-label",
      mono: "font-mono text-mono uppercase tracking-label",
      monoLg: "font-mono text-mono-lg uppercase tracking-button",
    },
  },
  defaultVariants: {
    tone: "soft",
    size: "body",
  },
});

type TextTag = "p" | "span" | "div" | "li" | "dt" | "dd" | "figcaption";

export interface TextProps
  extends ComponentPropsWithoutRef<"p">,
    VariantProps<typeof textVariants> {
  as?: TextTag;
}

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { as = "p", tone, size, className, ...props },
  ref,
) {
  // Widened so one ref type fits every allowed tag.
  const Component = as as ElementType;
  return (
    <Component
      ref={ref}
      className={cn(textVariants({ tone, size }), className)}
      {...props}
    />
  );
});
