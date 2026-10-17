import { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
}

export function GradientText({
  children,
  className,
}: GradientTextProps) {
  return (
    <span
      className={cn(
        "bg-linear-to-r from-violet-400 via-fuchsia-500 to-violet-300 bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}