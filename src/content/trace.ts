import type { Trace, TraceSpan } from "@/types/trace";

export const traceModes = ["frio", "quente"] as const;

export type TraceMode = (typeof traceModes)[number];

/**
 * Stages the waterfall always lists, in order. A stage with no span in the
 * trace (db.query on a warm cache) is rendered as skipped.
 */
export const traceStages = [
  { name: "edge", service: "CDN" },
  { name: "api.handler", service: "FastAPI" },
  { name: "cache.get", service: "Redis" },
  { name: "db.query", service: "PostgreSQL" },
  { name: "serialize", service: "Pydantic" },
] as const;

export const traceContent = {
  fire: { label: "▶ Disparar", request: "GET /home" },
  modeLabel: "Estado do cache",
  modes: [
    { value: "frio", label: "Cache frio" },
    { value: "quente", label: "Cache quente" },
  ],
  panelLabel: "Trace simulado da requisição GET /home",
  requestPrefix: "GET /api/home?lente=",
  running: "Em andamento…",
  durationPlaceholder: "—",
  skipped: "Pulado",
  cacheHit: "Hit",
  cacheMiss: "Miss",
  summary: {
    total: "Total",
    totalValue: "—",
    dbQueries: "Consultas ao banco",
    cache: "Cache",
  },
  simulationNote: "simulação: os valores reais entram quando a API estiver no ar",
} as const;

/** Screen-reader summary announced once a run finishes. */
export function describeTraceResult({
  cacheHit,
  dbQueries,
}: {
  cacheHit?: boolean;
  dbQueries: number;
}): string {
  const cache = cacheHit ? "Cache hit" : "Cache miss";
  const queries = dbQueries === 1 ? "1 consulta ao banco" : `${dbQueries} consultas ao banco`;
  return `Requisição concluída. ${cache}, ${queries}.`;
}

/** Reason phrases for the root span's `http.response.status_code`. */
export const httpReasonPhrases: Readonly<Record<number, string>> = {
  200: "OK",
};

// Simulated timestamps are in arbitrary units (cold request = 0..100): they
// only fix each bar's position and are never displayed.
const TRACE_ID = "simulated";

function span(
  spanId: string,
  name: string,
  start: number,
  length: number,
  attributes: TraceSpan["attributes"],
  parentSpanId?: string,
): TraceSpan {
  return {
    traceId: TRACE_ID,
    spanId,
    parentSpanId,
    name,
    kind: parentSpanId ? "INTERNAL" : "SERVER",
    startTimeUnixNano: start,
    endTimeUnixNano: start + length,
    attributes,
    status: { code: "OK" },
  };
}

export const simulatedTraces: Record<TraceMode, Trace> = {
  frio: {
    traceId: TRACE_ID,
    name: "GET /home",
    isSimulated: true,
    spans: [
      span("edge", "edge", 0, 100, { "service.name": "CDN", "http.response.status_code": 200 }),
      span("api", "api.handler", 3, 94, { "service.name": "FastAPI" }, "edge"),
      span("cache", "cache.get", 6, 7, { "service.name": "Redis", "cache.hit": false }, "api"),
      span("db", "db.query", 15, 47, { "service.name": "PostgreSQL", "db.system": "postgresql" }, "api"),
      span("serialize", "serialize", 64, 30, { "service.name": "Pydantic" }, "api"),
    ],
  },
  quente: {
    traceId: TRACE_ID,
    name: "GET /home",
    isSimulated: true,
    spans: [
      span("edge", "edge", 0, 34, { "service.name": "CDN", "http.response.status_code": 200 }),
      span("api", "api.handler", 3, 28, { "service.name": "FastAPI" }, "edge"),
      span("cache", "cache.get", 6, 7, { "service.name": "Redis", "cache.hit": true }, "api"),
      span("serialize", "serialize", 15, 14, { "service.name": "Pydantic" }, "api"),
    ],
  },
};
