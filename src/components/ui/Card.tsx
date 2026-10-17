import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const cardVariants = cva("rounded-card border", {
  variants: {
    variant: {
      surface: "border-line bg-surface text-fg",
      sunken: "border-line bg-sunken text-fg",
      /** The "current" item: inverted onto bone. */
      lit: "border-fg bg-fg text-bg",
    },
    padding: {
      none: "",
      md: "p-7",
    },
  },
  defaultVariants: {
    variant: "surface",
    padding: "md",
  },
});

export interface CardProps
  extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof cardVariants> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant, padding, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    />
  );
});
