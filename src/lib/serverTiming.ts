export interface ServerTimingEntry {
  name: string;
  /** Milliseconds. */
  dur: number;
}

/** Enough precision for sub-millisecond stages without leaking timer noise. */
const DURATION_DECIMALS = 3;

export function formatServerTiming(entries: readonly ServerTimingEntry[]): string {
  return entries.map(({ name, dur }) => `${name};dur=${dur.toFixed(DURATION_DECIMALS)}`).join(", ");
}

/** Reads `name;dur=1.2;desc="…"` entries; ones without a valid `dur` are dropped. */
export function parseServerTiming(header: string | null): ServerTimingEntry[] {
  if (!header) return [];
  return header.split(",").flatMap((part) => {
    const [name, ...params] = part.split(";").map((piece) => piece.trim());
    const durParam = params.find((param) => param.startsWith("dur="));
    const dur = durParam ? Number(durParam.slice("dur=".length)) : Number.NaN;
    return name && Number.isFinite(dur) ? [{ name, dur }] : [];
  });
}
