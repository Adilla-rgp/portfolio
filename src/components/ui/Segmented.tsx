import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
}

export interface SegmentedProps<T extends string>
  extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  options: readonly SegmentedOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  /** Required: the group has no visible label of its own. */
  "aria-label": string;
}

const segmentedItemVariants = cva(
  "min-h-9 cursor-pointer rounded-pill px-4 font-mono text-mono-sm font-bold uppercase tracking-label transition-colors duration-150 ease-out-expo",
  {
    variants: {
      pressed: {
        true: "bg-signal text-bg hover:text-bg",
        false: "text-muted hover:text-fg",
      },
    },
  },
);

function SegmentedInner<T extends string>(
  { options, value, onValueChange, className, ...props }: SegmentedProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      role="group"
      className={cn(
        "inline-flex gap-1 rounded-pill border border-line-strong bg-bg p-1",
        className,
      )}
      {...props}
    >
      {options.map((option) => {
        const pressed = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={pressed}
            onClick={() => onValueChange(option.value)}
            className={segmentedItemVariants({ pressed })}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

// forwardRef erases generics; the cast restores `T` inference from `options`.
export const Segmented = forwardRef(SegmentedInner) as <T extends string>(
  props: SegmentedProps<T> & { ref?: Ref<HTMLDivElement> },
) => ReactElement;
