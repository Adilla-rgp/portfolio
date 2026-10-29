import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const textAreaVariants = cva(
  "block w-full resize-y rounded-item border bg-bg px-4 py-3 text-fg transition-colors duration-150 ease-out-expo placeholder:text-muted hover:border-fg-soft",
  {
    variants: {
      font: {
        sans: "font-sans text-body",
        /** Code, logs and error messages. */
        mono: "font-mono text-mono",
      },
      tone: {
        default: "border-line-strong",
        signal: "border-signal",
      },
    },
    defaultVariants: {
      font: "sans",
      tone: "default",
    },
  },
);

export interface TextAreaProps
  extends ComponentPropsWithoutRef<"textarea">,
    VariantProps<typeof textAreaVariants> {}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { font, tone, className, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cn(textAreaVariants({ font, tone }), className)}
      {...props}
    />
  );
});
