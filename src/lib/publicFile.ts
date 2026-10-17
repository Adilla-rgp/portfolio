import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Whether a file is present in public/. Read on the server while the page is
 * prerendered, so dropping in a photo or a PDF and rebuilding is enough to
 * swap a placeholder for the real thing.
 */
export function publicFileExists(href: string): boolean {
  return existsSync(join(process.cwd(), "public", href));
}
