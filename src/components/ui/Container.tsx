import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export type ContainerProps = ComponentPropsWithoutRef<"div">;

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  function Container({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full max-w-page px-gutter-sm md:px-gutter",
          className,
        )}
        {...props}
      />
    );
  },
);
