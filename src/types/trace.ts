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
  "db.system"?: string;
  "cache.hit"?: boolean;
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
  /** Root span name, e.g. `GET /home`. */
  name: string;
  spans: readonly TraceSpan[];
  /**
   * True for hand-made traces. Their timestamps only set bar proportions and
   * must never be shown as durations.
   */
  isSimulated: boolean;
}
