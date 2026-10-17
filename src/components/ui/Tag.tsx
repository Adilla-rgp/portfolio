import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const tagVariants = cva(
  "inline-flex items-center gap-2 rounded-pill border px-3 py-1.5 font-mono text-mono-sm uppercase tracking-label whitespace-nowrap",
  {
    variants: {
      tone: {
        default: "border-line-strong text-fg-soft",
        signal: "border-signal text-signal",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

export interface TagProps
  extends ComponentPropsWithoutRef<"span">,
    VariantProps<typeof tagVariants> {}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { tone, className, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(tagVariants({ tone }), className)}
      {...props}
    />
  );
});
