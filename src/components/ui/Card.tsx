import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const cardVariants = cva("border", {
  variants: {
    variant: {
      surface: "border-line bg-surface text-fg",
      sunken: "border-line bg-sunken text-fg",
      /** The "current" item: inverted onto bone. */
      lit: "border-fg bg-fg text-bg",
      /** Border only, for items sitting on a section background. */
      outline: "border-line bg-transparent text-fg",
    },
    radius: {
      card: "rounded-card",
      item: "rounded-item",
    },
    padding: {
      none: "",
      sm: "p-4.5",
      md: "p-7",
    },
  },
  defaultVariants: {
    variant: "surface",
    radius: "card",
    padding: "md",
  },
});

export interface CardProps
  extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof cardVariants> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant, radius, padding, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, radius, padding }), className)}
      {...props}
    />
  );
});
