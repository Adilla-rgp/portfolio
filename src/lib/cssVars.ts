import type { CSSProperties } from "react";

/**
 * Typed bridge for runtime values passed to CSS as custom properties (see the
 * inline-style exception in AGENTS.md). React's CSSProperties has no index
 * signature for `--*` names.
 */
export function cssVars(vars: Record<`--${string}`, string | number>): CSSProperties {
  return vars as CSSProperties;
}
