import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const sectionVariants = cva("relative", {
  variants: {
    spacing: {
      section: "py-section",
      /** For full-bleed blocks that manage their own height, like the hero. */
      none: "",
    },
    tone: {
      bg: "bg-bg",
      sunken: "bg-sunken",
    },
    bordered: {
      true: "border-t border-line",
      false: "",
    },
  },
  defaultVariants: {
    spacing: "section",
    tone: "bg",
    bordered: true,
  },
});

export interface SectionProps
  extends ComponentPropsWithoutRef<"section">,
    VariantProps<typeof sectionVariants> {}

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { spacing, tone, bordered, className, ...props },
  ref,
) {
  return (
    <section
      ref={ref}
      className={cn(sectionVariants({ spacing, tone, bordered }), className)}
      {...props}
    />
  );
});
