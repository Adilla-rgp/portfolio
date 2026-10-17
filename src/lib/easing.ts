export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function easeOutCubic(value: number): number {
  return 1 - Math.pow(1 - value, 3);
}
