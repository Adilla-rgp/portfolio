import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const sectionVariants = cva("relative py-section", {
  variants: {
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
    tone: "bg",
    bordered: true,
  },
});

export interface SectionProps
  extends ComponentPropsWithoutRef<"section">,
    VariantProps<typeof sectionVariants> {}

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { tone, bordered, className, ...props },
  ref,
) {
  return (
    <section
      ref={ref}
      className={cn(sectionVariants({ tone, bordered }), className)}
      {...props}
    />
  );
});
