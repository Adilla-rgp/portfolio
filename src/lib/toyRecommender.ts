/**
 * Hand-written stand-in for the research model, small enough to run in the
 * browser (docs/design-reference/Rec.dc.html). Topics are indices into a
 * curriculum-ordered list: the next topic pulls hardest, nearby ones less,
 * and thematic links add extra pull. Not trained on any data.
 */

const AFFINITY = {
  next: 1,
  skipOne: 0.45,
  previous: 0.12,
  other: 0.06,
  thematic: 0.55,
} as const;

/** Each step back in the sequence weighs this much less. */
const RECENCY_DECAY = 0.55;
/** Softmax temperature: lower makes the top prediction more confident. */
const TEMPERATURE = 0.18;
/** Every item gets a sliver of attention, so no bar is ever empty. */
const ATTENTION_FLOOR = 0.02;

export type AffinityMatrix = readonly (readonly number[])[];

export function buildAffinity(
  size: number,
  thematic: readonly (readonly [number, number])[],
): AffinityMatrix {
  return Array.from({ length: size }, (_, from) =>
    Array.from({ length: size }, (_, to) => {
      if (from === to) return 0;
      const distance = to - from;
      const base =
        distance === 1
          ? AFFINITY.next
          : distance === 2
            ? AFFINITY.skipOne
            : distance === -1
              ? AFFINITY.previous
              : AFFINITY.other;
      const isThematic = thematic.some(([a, b]) => a === from && b === to);
      return base + (isThematic ? AFFINITY.thematic : 0);
    }),
  );
}

export interface Prediction {
  item: number;
  probability: number;
}

export interface ToyPrediction {
  /** Candidates not yet in the sequence, most likely first. */
  ranked: Prediction[];
  /** Share of attention per sequence position toward the top prediction (sums to 1). */
  attention: number[];
}

export function predictNext(sequence: readonly number[], affinity: AffinityMatrix): ToyPrediction {
  const length = sequence.length;
  const recency = sequence.map((_, index) => Math.pow(RECENCY_DECAY, length - 1 - index));
  const candidates = affinity.map((_, item) => item).filter((item) => !sequence.includes(item));

  const scores = candidates.map((candidate) =>
    sequence.reduce((sum, item, index) => sum + recency[index] * affinity[item][candidate], 0),
  );
  const exps = scores.map((score) => Math.exp(score / TEMPERATURE));
  const total = exps.reduce((sum, value) => sum + value, 0) || 1;
  const ranked = candidates
    .map((item, index) => ({ item, probability: exps[index] / total }))
    .sort((a, b) => b.probability - a.probability);

  const best = ranked[0];
  const raw = sequence.map(
    (item, index) => (best ? recency[index] * affinity[item][best.item] : 0) + ATTENTION_FLOOR,
  );
  const rawTotal = raw.reduce((sum, value) => sum + value, 0) || 1;

  return { ranked, attention: raw.map((value) => value / rawTotal) };
}

/** Rec.dc.html: a new pair of masked positions every 1.8s, revealed at 60%. */
export const maskingLoop = { step: 1.8, revealAt: 0.6 } as const;

const MASK_STRIDES = [3, 5] as const;
const MASK_OFFSETS = [1, 4] as const;
const MASK_FALLBACK_SHIFT = 3;

/** Two distinct positions to hide at a given training step. */
export function maskedPositions(step: number, length: number): [number, number] {
  const first = (step * MASK_STRIDES[0] + MASK_OFFSETS[0]) % length;
  const second = (step * MASK_STRIDES[1] + MASK_OFFSETS[1]) % length;
  return [first, second === first ? (first + MASK_FALLBACK_SHIFT) % length : second];
}

export type TokenRole = "masked" | "used" | "ignored";

/**
 * Bidirectional context sees every unmasked item; left-only context sees
 * only what comes before the first hidden position.
 */
export function tokenRole(
  position: number,
  masked: readonly number[],
  bidirectional: boolean,
): TokenRole {
  if (masked.includes(position)) return "masked";
  if (bidirectional || position < Math.min(...masked)) return "used";
  return "ignored";
}
