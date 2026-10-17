import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge only knows Tailwind's default scales. Without registering the
// custom tokens from src/styles/tokens.css, `text-h2` would be read as a color
// and silently dropped when merged with `text-fg` (and vice versa).
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "display",
        "display-xl",
        "h2",
        "h3",
        "project",
        "number",
        "stat",
        "marquee",
        "body-lg",
        "body",
        "mono-sm",
        "mono",
        "mono-lg",
        "mono-xl",
        "mono-xs",
      ],
      tracking: ["kicker", "label", "button"],
      radius: ["pill", "card", "item", "chip"],
      spacing: ["gutter", "gutter-sm", "section", "hero", "trace-panel"],
      container: ["page"],
      ease: ["out-expo"],
      animate: ["marquee", "marquee-fast", "blink"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
