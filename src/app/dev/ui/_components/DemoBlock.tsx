import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface DemoBlockProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function DemoBlock({ title, children, className }: DemoBlockProps) {
  return (
    <div className={cn("flex flex-col gap-5 border-t border-line pt-6", className)}>
      <h3 className="font-mono text-mono-sm uppercase tracking-label text-muted">{title}</h3>
      {children}
    </div>
  );
}
