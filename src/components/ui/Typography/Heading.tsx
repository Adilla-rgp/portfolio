import { ReactNode } from "react";
import { cn } from "@/lib/cn";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5";

type HeadingSize =
  | "hero"
  | "display"
  | "xl"
  | "lg"
  | "md"
  | "sm";

type HeadingAlign = "left" | "center" | "right";

type HeadingWeight =
  | "regular"
  | "medium"
  | "semibold"
  | "bold";

interface HeadingProps {
  children: ReactNode;
  level?: HeadingLevel;
  size?: HeadingSize;
  align?: HeadingAlign;
  weight?: HeadingWeight;
  className?: string;
}

const sizeClasses = {
  hero: "text-6xl md:text-8xl",
  display: "text-5xl md:text-7xl",
  xl: "text-4xl",
  lg: "text-3xl",
  md: "text-2xl",
  sm: "text-xl",
};

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const weightClasses = {
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

export function Heading({
  children,
  level = "h1",
  size = "xl",
  align = "left",
  weight = "bold",
  className,
}: HeadingProps) {
  const Component = level;

  return (
    <Component
      className={cn(
        sizeClasses[size],
        alignClasses[align],
        weightClasses[weight],
        "text-white tracking-tight",
        className
      )}
    >
      {children}
    </Component>
  );
}