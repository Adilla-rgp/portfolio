import type { CacheVerdict } from "@/content/cache";

const SEPARATOR = /[^\p{L}\p{N}]+/u;

/** Lowercase words and numbers; everything else separates tokens. */
export function tokenize(text: string): string[] {
  return text.toLowerCase().split(SEPARATOR).filter(Boolean);
}

/** Tokens without repeats, in order of first appearance. */
export function uniqueTokens(text: string): string[] {
  return [...new Set(tokenize(text))];
}

export interface TokenOverlap {
  shared: number;
  union: number;
  similarity: number;
}

/** Jaccard over token sets: |A ∩ B| / |A ∪ B|, 0 when both are empty. */
export function jaccard(a: string, b: string): TokenOverlap {
  const left = new Set(tokenize(a));
  const right = new Set(tokenize(b));
  const shared = [...left].filter((token) => right.has(token)).length;
  const union = left.size + right.size - shared;
  return { shared, union, similarity: union === 0 ? 0 : shared / union };
}

export interface ExpectedGot {
  expected: string;
  got: string;
}

/** The values after "expected" and after the "got" that follows it, if both are present. */
export function parseExpectedGot(text: string): ExpectedGot | null {
  const tokens = tokenize(text);
  const expectedAt = tokens.indexOf("expected");
  const gotAt = tokens.indexOf("got", expectedAt + 1);
  if (expectedAt === -1 || gotAt === -1) return null;
  return {
    expected: tokens.slice(expectedAt + 1, gotAt).join(" "),
    got: tokens.slice(gotAt + 1).join(" "),
  };
}

/**
 * Field-by-field check that runs before a similarity hit is reused: false when
 * both messages carry Expected and Got and either value differs, null when the
 * triage does not apply.
 */
export function triagePasses(a: string, b: string): boolean | null {
  const left = parseExpectedGot(a);
  const right = parseExpectedGot(b);
  if (!left || !right) return null;
  return left.expected === right.expected && left.got === right.got;
}

export interface CacheMatchInput {
  incoming: string;
  cached: string;
  threshold: number;
  triage: boolean;
}

export interface CacheMatch extends TokenOverlap {
  verdict: CacheVerdict;
}

export function matchCache({ incoming, cached, threshold, triage }: CacheMatchInput): CacheMatch {
  const overlap = jaccard(incoming, cached);
  // MD5 of identical text is identical, so the string comparison stands in for the hash.
  if (incoming.trim() !== "" && incoming === cached) return { ...overlap, verdict: "exact" };
  if (overlap.similarity < threshold) return { ...overlap, verdict: "miss" };
  if (triage && triagePasses(incoming, cached) === false) return { ...overlap, verdict: "rejected" };
  return { ...overlap, verdict: "similar" };
}
