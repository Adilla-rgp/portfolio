import { ReactNode } from "react";
import { cn } from "@/lib/cn";

type LabelVariant = "default" | "primary" | "outline";

interface LabelProps {
  children: ReactNode;
  variant?: LabelVariant;
  uppercase?: boolean;
  className?: string;
}

const variantClasses = {
  default: "text-zinc-400",

  primary: "text-violet-400",

  outline:
    "border border-violet-500/30 px-3 py-1 rounded-full text-violet-300",
};

export function Label({
  children,
  variant = "default",
  uppercase = false,
  className,
}: LabelProps) {
  return (
    <span
      className={cn(
        "text-sm font-medium tracking-wide",
        uppercase && "uppercase",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}