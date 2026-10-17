"use client";

import { Segmented } from "@/components/ui/Segmented";
import { lensContent } from "@/content/lens";
import { useLens } from "./LensProvider";

interface LensSwitchProps {
  className?: string;
}

export function LensSwitch({ className }: LensSwitchProps) {
  const { lens, setLens } = useLens();

  return (
    <Segmented
      aria-label={lensContent.switchLabel}
      options={lensContent.options}
      value={lens}
      onValueChange={setLens}
      className={className}
    />
  );
}
