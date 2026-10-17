import { defaultLens, lenses, type Lens } from "@/content/lens";

export function isLens(value: unknown): value is Lens {
  return lenses.some((lens) => lens === value);
}

/** Anything that is not a known lens falls back to the default. */
export function parseLens(value: string | string[] | undefined): Lens {
  const candidate = Array.isArray(value) ? value[0] : value;
  return isLens(candidate) ? candidate : defaultLens;
}
