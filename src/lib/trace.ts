import type { Trace, TraceSpan } from "@/types/trace";

export type WaterfallRowKind = "cache" | "db" | "other";

export interface WaterfallRow {
  name: string;
  service: string;
  kind: WaterfallRowKind;
  /** The stage has no span in this trace (e.g. db.query on a cache hit). */
  skipped: boolean;
  /** Fractions of the shared time scale (0..1). */
  start: number;
  width: number;
  end: number;
  cacheHit?: boolean;
}

interface Stage {
  name: string;
  service: string;
}

/** Skipped stages are flagged shortly after playback starts. */
const SKIPPED_FLAG_AT = 0.1;

export function getRootSpan(trace: Trace): TraceSpan | undefined {
  return trace.spans.find((span) => !span.parentSpanId);
}

function spanDuration(span: TraceSpan): number {
  return span.endTimeUnixNano - span.startTimeUnixNano;
}

/**
 * Longest root span across traces, so several traces drawn on the same axis
 * stay comparable (a warm request reads as a fraction of the cold one).
 */
export function getSharedScale(traces: readonly Trace[]): number {
  return Math.max(...traces.map((trace) => {
    const root = getRootSpan(trace);
    return root ? spanDuration(root) : 0;
  }));
}

function rowKind(span: TraceSpan): WaterfallRowKind {
  if (span.attributes["db.system"]) return "db";
  if (span.attributes["cache.hit"] !== undefined) return "cache";
  return "other";
}

export function buildWaterfall(
  trace: Trace,
  stages: readonly Stage[],
  scale: number,
): WaterfallRow[] {
  const root = getRootSpan(trace);
  const origin = root?.startTimeUnixNano ?? 0;

  return stages.map((stage) => {
    const span = trace.spans.find((candidate) => candidate.name === stage.name);
    if (!span) {
      return {
        name: stage.name,
        service: stage.service,
        kind: "other",
        skipped: true,
        start: 0,
        width: 0,
        end: SKIPPED_FLAG_AT,
      };
    }

    const start = (span.startTimeUnixNano - origin) / scale;
    const width = spanDuration(span) / scale;
    return {
      name: span.name,
      service: span.attributes["service.name"],
      kind: rowKind(span),
      skipped: false,
      start,
      width,
      end: start + width,
      cacheHit: span.attributes["cache.hit"],
    };
  });
}

export interface TraceSummary {
  /** Fraction of the shared scale at which the root span ends. */
  end: number;
  statusCode?: number;
  dbQueries: number;
  cacheHit?: boolean;
}

export function summarizeTrace(trace: Trace, scale: number): TraceSummary {
  const root = getRootSpan(trace);
  const cacheSpan = trace.spans.find((span) => span.attributes["cache.hit"] !== undefined);

  return {
    end: root ? spanDuration(root) / scale : 0,
    statusCode: root?.attributes["http.response.status_code"],
    dbQueries: trace.spans.filter((span) => span.attributes["db.system"]).length,
    cacheHit: cacheSpan?.attributes["cache.hit"],
  };
}
