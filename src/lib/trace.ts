import type { Trace, TraceSpan } from "@/types/trace";

export type WaterfallRowKind = "server" | "network";

export interface WaterfallRow {
  name: string;
  service: string;
  kind: WaterfallRowKind;
  /** The stage has no span in this trace (e.g. server stages on a CDN hit). */
  skipped: boolean;
  /** Shown in place of a duration when the stage was skipped. */
  skippedLabel: string;
  /** Fractions of the shared time scale (0..1). */
  start: number;
  width: number;
  end: number;
  durationMs: number;
}

interface Stage {
  name: string;
  service: string;
  skippedLabel: string;
}

const NS_PER_MS = 1e6;

/** Skipped stages are flagged shortly after playback starts. */
const SKIPPED_FLAG_AT = 0.1;

export function getRootSpan(trace: Trace): TraceSpan | undefined {
  return trace.spans.find((span) => !span.parentSpanId);
}

function spanDuration(span: TraceSpan): number {
  return span.endTimeUnixNano - span.startTimeUnixNano;
}

function toMs(ns: number): number {
  return ns / NS_PER_MS;
}

/**
 * Longest root span across traces, so several traces drawn on the same axis
 * stay comparable (a warm request reads as a fraction of the cold one).
 */
export function getSharedScale(traces: readonly Trace[]): number {
  return Math.max(
    0,
    ...traces.map((trace) => {
      const root = getRootSpan(trace);
      return root ? spanDuration(root) : 0;
    }),
  );
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
    if (!span || scale <= 0) {
      return {
        name: stage.name,
        service: stage.service,
        kind: "network",
        skipped: true,
        skippedLabel: stage.skippedLabel,
        start: 0,
        width: 0,
        end: SKIPPED_FLAG_AT,
        durationMs: 0,
      };
    }

    const start = (span.startTimeUnixNano - origin) / scale;
    const width = spanDuration(span) / scale;
    return {
      name: span.name,
      service: span.attributes["service.name"],
      kind: span.kind === "SERVER" ? "server" : "network",
      skipped: false,
      skippedLabel: stage.skippedLabel,
      start,
      width,
      end: start + width,
      durationMs: toMs(spanDuration(span)),
    };
  });
}

export interface TraceSummary {
  /** Fraction of the shared scale at which the root span ends. */
  end: number;
  statusCode?: number;
  totalMs: number;
  /** Time spent in server stages; null when the server did not run. */
  serverMs: number | null;
  /** `x-vercel-cache`; null where there is no Vercel CDN. */
  cache: string | null;
}

export function summarizeTrace(trace: Trace, scale: number): TraceSummary {
  const root = getRootSpan(trace);
  const serverSpans = trace.spans.filter((span) => span.kind === "SERVER");
  const total = root ? spanDuration(root) : 0;

  return {
    end: scale > 0 ? total / scale : 0,
    statusCode: root?.attributes["http.response.status_code"],
    totalMs: toMs(total),
    serverMs: serverSpans.length
      ? toMs(serverSpans.reduce((sum, span) => sum + spanDuration(span), 0))
      : null,
    cache: root?.attributes["vercel.cache"] ?? null,
  };
}
