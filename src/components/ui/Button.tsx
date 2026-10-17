import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ForwardedRef,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-3 rounded-pill font-mono font-bold uppercase tracking-button whitespace-nowrap transition-colors duration-150 ease-out-expo disabled:pointer-events-none disabled:text-faint",
  {
    variants: {
      variant: {
        signal: "bg-signal text-bg hover:bg-fg hover:text-bg",
        outline:
          "border border-line-strong bg-bg text-fg-soft hover:border-fg hover:text-fg",
        ghost: "text-fg-soft hover:bg-raised hover:text-fg",
      },
      size: {
        md: "min-h-11 px-5 text-mono-sm",
        lg: "min-h-13 px-6 text-mono-lg",
      },
    },
    defaultVariants: {
      variant: "signal",
      size: "md",
    },
  },
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

type ButtonAsButton = ButtonVariantProps &
  ComponentPropsWithoutRef<"button"> & { as?: "button" };

type ButtonAsAnchor = ButtonVariantProps &
  ComponentPropsWithoutRef<"a"> & { as: "a" };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

/**
 * Pill button. Use `as="a"` for plain links; for Next.js `<Link>`, apply
 * `buttonVariants()` to the Link's className instead.
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(props, ref) {
    if (props.as === "a") {
      const { as: Component, variant, size, className, ...anchorProps } = props;
      return (
        <Component
          ref={ref as ForwardedRef<HTMLAnchorElement>}
          className={cn(buttonVariants({ variant, size }), className)}
          {...anchorProps}
        />
      );
    }

    const {
      as: Component = "button",
      variant,
      size,
      className,
      type = "button",
      ...buttonProps
    } = props;
    return (
      <Component
        ref={ref as ForwardedRef<HTMLButtonElement>}
        type={type}
        className={cn(buttonVariants({ variant, size }), className)}
        {...buttonProps}
      />
    );
  },
);
