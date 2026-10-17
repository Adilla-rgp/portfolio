import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const navLinkVariants = cva(
  "inline-flex min-h-11 items-center font-mono uppercase text-fg transition-colors duration-150 hover:text-signal",
  {
    variants: {
      size: {
        sm: "text-mono tracking-label",
        md: "text-mono-lg tracking-button",
      },
      weight: {
        regular: "font-normal",
        bold: "font-bold",
      },
    },
    defaultVariants: {
      size: "sm",
      weight: "regular",
    },
  },
);

export interface NavLinkProps
  extends ComponentPropsWithoutRef<"a">,
    VariantProps<typeof navLinkVariants> {}

/** Mono uppercase text link with a 44px touch target (header, footer). */
export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(
  { size, weight, className, ...props },
  ref,
) {
  return (
    <a
      ref={ref}
      className={cn(navLinkVariants({ size, weight }), className)}
      {...props}
    />
  );
});
