import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Color tokens read from src/styles/tokens.css, for build-time renderers that
 * cannot resolve CSS variables (next/og images). Keeps tokens.css the only
 * place where the hex values live.
 */
export function readColorTokens<Name extends string>(names: readonly Name[]): Record<Name, string> {
  const css = readFileSync(join(process.cwd(), "src/styles/tokens.css"), "utf8");
  return Object.fromEntries(
    names.map((name) => {
      // No backslash escapes here: the production minifier mangles `\s` inside
      // template literals, which silently broke this pattern.
      const match = css.match(new RegExp(`--color-${name}:[ ]*(#[0-9a-fA-F]{3,8})`));
      if (!match) throw new Error(`Color token --color-${name} not found in tokens.css`);
      return [name, match[1]];
    }),
  ) as Record<Name, string>;
}
