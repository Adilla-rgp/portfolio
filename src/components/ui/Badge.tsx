import { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-sm text-violet-300",
        className
      )}
    >
      {children}
    </span>
  );
}