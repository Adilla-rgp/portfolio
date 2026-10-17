import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export type AccentProps = ComponentPropsWithoutRef<"span">;

/** Signal-colored run inside a title, e.g. the closing period of `ao sistema.` */
export const Accent = forwardRef<HTMLSpanElement, AccentProps>(function Accent(
  { className, ...props },
  ref,
) {
  return <span ref={ref} className={cn("text-signal", className)} {...props} />;
});
