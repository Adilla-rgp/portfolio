/**
 * Subset of an OpenTelemetry span as exported in OTLP JSON, with just what a
 * waterfall needs. OTLP encodes the `*UnixNano` fields as strings; convert them
 * at the API boundary so this shape stays numeric.
 */
export type SpanKind = "SERVER" | "CLIENT" | "INTERNAL";

export type SpanStatusCode = "UNSET" | "OK" | "ERROR";

export interface SpanAttributes {
  "service.name": string;
  "http.response.status_code"?: number;
  /** Vercel CDN cache state (`x-vercel-cache`), absent outside Vercel. */
  "vercel.cache"?: string;
}

export interface TraceSpan {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  name: string;
  kind: SpanKind;
  startTimeUnixNano: number;
  endTimeUnixNano: number;
  attributes: SpanAttributes;
  status: { code: SpanStatusCode };
}

export interface Trace {
  traceId: string;
  /** Root span name, e.g. `GET /api/home`. */
  name: string;
  spans: readonly TraceSpan[];
}
