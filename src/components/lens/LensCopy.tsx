"use client";

import type { ByLens } from "@/content/lens";
import { useLens } from "./LensProvider";

interface LensCopyProps {
  values: ByLens<string>;
}

/** Inline text that follows the current lens. Wrap it in the typography you need. */
export function LensCopy({ values }: LensCopyProps) {
  const { lens } = useLens();
  return values[lens];
}

/** The lens id itself, e.g. the `backend` in `LENTE /backend`. */
export function LensName() {
  const { lens } = useLens();
  return lens;
}
