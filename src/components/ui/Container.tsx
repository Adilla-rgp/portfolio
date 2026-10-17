import { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({
  children,
  className,
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-7xl px-6 lg:px-10",
        className
      )}
    >
      {children}
    </div>
  );
}