import { serverStages } from "@/lib/homeApi";

export const traceModes = ["frio", "quente"] as const;

export type TraceMode = (typeof traceModes)[number];

/**
 * Stages the waterfall always lists, in order. A stage with no span in the
 * trace is shown as skipped: DNS and the connection when the browser reuses
 * them, the server stages when the CDN answers from cache.
 */
export const traceStages = [
  { name: "dns", service: "Navegador", skippedLabel: "Em cache" },
  { name: "tcp", service: "Navegador", skippedLabel: "Reusada" },
  { name: "tls", service: "Navegador", skippedLabel: "Reusada" },
  { name: "ttfb", service: "Rede + servidor", skippedLabel: "Pulado" },
  { name: serverStages.content, service: "Next.js", skippedLabel: "Pulado" },
  { name: serverStages.serialize, service: "Next.js", skippedLabel: "Pulado" },
  { name: "download", service: "Rede", skippedLabel: "Pulado" },
] as const;

export type TraceStageName = (typeof traceStages)[number]["name"];

export const traceContent = {
  fire: { label: "▶ Disparar", request: "GET /api/home" },
  modeLabel: "Estado do cache",
  modes: [
    { value: "frio", label: "Cache frio" },
    { value: "quente", label: "Cache quente" },
  ],
  rootName: "GET /api/home",
  rootService: "Navegador",
  panelLabel: "Trace da requisição GET /api/home",
  request: "GET /api/home",
  coldSuffix: "?nocache=…",
  running: "Em andamento…",
  noValue: "—",
  summary: {
    total: "Total",
    server: "Servidor",
    cache: "Cache CDN",
  },
  liveNote: "medido agora, no seu navegador",
  measuringNote: "medindo no seu navegador…",
  recordedNote: (date: string) => `gravação de ${date}: não foi possível medir agora`,
} as const;

const dateFormat = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" });
const decimal = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });
const integer = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

/** Below this, a stage reads as "<0,1 ms" rather than a misleading 0. */
const MIN_SHOWN_MS = 0.1;
/** From here on, decimals are timer noise. */
const WHOLE_MS_FROM = 10;

export function formatDuration(ms: number): string {
  if (ms < MIN_SHOWN_MS) return `<${decimal.format(MIN_SHOWN_MS)} ms`;
  return `${(ms < WHOLE_MS_FROM ? decimal : integer).format(ms)} ms`;
}

export function formatRecordedAt(iso: string): string {
  return dateFormat.format(new Date(iso));
}

/** Screen-reader summary announced once a run finishes. */
export function describeTraceResult({
  totalMs,
  serverMs,
  cache,
  isRecorded,
}: {
  totalMs: number;
  serverMs: number | null;
  cache: string | null;
  isRecorded: boolean;
}): string {
  const prefix = isRecorded ? "Gravação: requisição" : "Requisição";
  const server =
    serverMs === null ? "servidor pulado pela CDN" : `servidor ${formatDuration(serverMs)}`;
  const cdn = cache ? `cache da CDN ${cache}` : "sem cache de CDN";
  return `${prefix} concluída em ${formatDuration(totalMs)}: ${server}, ${cdn}.`;
}

/** Reason phrases for the root span's `http.response.status_code`. */
export const httpReasonPhrases: Readonly<Record<number, string>> = {
  200: "OK",
};
