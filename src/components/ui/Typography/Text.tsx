import { ReactNode } from "react";
import { cn } from "@/lib/cn";

type TextVariant = "default" | "secondary" | "muted";

type TextSize = "sm" | "md" | "lg" | "xl";

type TextAlign = "left" | "center" | "right";

interface TextProps {
  children: ReactNode;
  variant?: TextVariant;
  size?: TextSize;
  align?: TextAlign;
  className?: string;
}

const variantClasses = {
  default: "text-white",
  secondary: "text-zinc-300",
  muted: "text-zinc-500",
};

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function Text({
  children,
  variant = "default",
  size = "md",
  align = "left",
  className,
}: TextProps) {
  return (
    <p
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        alignClasses[align],
        "leading-relaxed",
        className
      )}
    >
      {children}
    </p>
  );
}