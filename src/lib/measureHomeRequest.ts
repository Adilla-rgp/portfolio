import type { TraceMode } from "@/content/trace";
import { homeApiUrl } from "@/lib/homeApi";
import { parseServerTiming } from "@/lib/serverTiming";
import { measurementToTrace, type ResourceMarks } from "@/lib/traceMeasure";
import type { Trace } from "@/types/trace";

export interface RecordedTrace {
  trace: Trace;
  /** ISO date of the run. */
  recordedAt: string;
}

/** The Resource Timing entry lands right after the body; give it a few ticks. */
const ENTRY_ATTEMPTS = 10;
const ENTRY_RETRY_MS = 16;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function findResourceEntry(
  href: string,
  startedAt: number,
): Promise<PerformanceResourceTiming | undefined> {
  for (let attempt = 0; attempt < ENTRY_ATTEMPTS; attempt += 1) {
    const entry = performance
      .getEntriesByName(href, "resource")
      .filter((candidate) => candidate.startTime >= startedAt)
      .at(-1);
    if (entry) return entry as PerformanceResourceTiming;
    await wait(ENTRY_RETRY_MS);
  }
  return undefined;
}

/** Without a Resource Timing entry, the fetch's own timestamps still give wait and download. */
function fallbackMarks(startedAt: number, headersAt: number, endAt: number): ResourceMarks {
  return {
    startTime: startedAt,
    domainLookupStart: startedAt,
    domainLookupEnd: startedAt,
    connectStart: startedAt,
    secureConnectionStart: 0,
    connectEnd: startedAt,
    requestStart: startedAt,
    responseStart: headersAt,
    responseEnd: endAt,
  };
}

/**
 * Fetches the Home API from this browser and returns the request as a trace.
 * The cold run adds a unique query, so neither the CDN nor the browser can
 * answer it from cache.
 */
export async function measureHomeRequest(mode: TraceMode): Promise<RecordedTrace> {
  const isCold = mode === "frio";
  const url = homeApiUrl(window.location.href, isCold ? String(Date.now()) : null);

  const startedAt = performance.now();
  const response = await fetch(url, { cache: isCold ? "no-store" : "default" });
  const headersAt = performance.now();
  if (!response.ok) throw new Error(`GET ${url.pathname} respondeu ${response.status}`);
  await response.arrayBuffer();
  const endAt = performance.now();

  const entry = await findResourceEntry(url.href, startedAt);
  const trace = measurementToTrace({
    traceId: crypto.randomUUID().replaceAll("-", ""),
    timeOrigin: performance.timeOrigin,
    marks: entry ?? fallbackMarks(startedAt, headersAt, endAt),
    serverTiming: parseServerTiming(response.headers.get("server-timing")),
    vercelCache: response.headers.get("x-vercel-cache"),
    statusCode: response.status,
  });
  return { trace, recordedAt: new Date().toISOString() };
}

const storageKey = (mode: TraceMode) => `trace:ultima-execucao:${mode}`;

function isRecordedTrace(value: unknown): value is RecordedTrace {
  if (typeof value !== "object" || value === null) return false;
  const { trace, recordedAt } = value as Partial<RecordedTrace>;
  return (
    typeof recordedAt === "string" &&
    typeof trace?.traceId === "string" &&
    Array.isArray(trace.spans)
  );
}

/** Storage can be missing or blocked; the demo then falls back to the bundled recording. */
export function saveLastRun(mode: TraceMode, run: RecordedTrace): void {
  try {
    localStorage.setItem(storageKey(mode), JSON.stringify(run));
  } catch {
    // Nothing to keep; the bundled recording still covers a failed fetch.
  }
}

export function loadLastRun(mode: TraceMode): RecordedTrace | null {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(storageKey(mode)) ?? "null");
    return isRecordedTrace(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
