import { describe, expect, it } from "vitest";
import { describeTraceResult, formatDuration, traceStages } from "@/content/trace";
import { buildWaterfall, getRootSpan, getSharedScale, summarizeTrace } from "@/lib/trace";
import { measurementToTrace, type RequestMeasurement } from "@/lib/traceMeasure";

/** A cold request on a new HTTPS connection, in ms from the time origin. */
const cold: RequestMeasurement = {
  traceId: "cold",
  timeOrigin: 0,
  marks: {
    startTime: 100,
    domainLookupStart: 101,
    domainLookupEnd: 111,
    connectStart: 111,
    secureConnectionStart: 131,
    connectEnd: 151,
    requestStart: 152,
    responseStart: 252,
    responseEnd: 262,
  },
  serverTiming: [
    { name: "content", dur: 2 },
    { name: "serialize", dur: 1 },
  ],
  vercelCache: "MISS",
  statusCode: 200,
};

/** The same request answered by the CDN on a reused connection. */
const warm: RequestMeasurement = {
  ...cold,
  traceId: "warm",
  marks: {
    startTime: 100,
    domainLookupStart: 100,
    domainLookupEnd: 100,
    connectStart: 100,
    secureConnectionStart: 0,
    connectEnd: 100,
    requestStart: 101,
    responseStart: 131,
    responseEnd: 135,
  },
  vercelCache: "HIT",
};

const coldTrace = measurementToTrace(cold);
const warmTrace = measurementToTrace(warm);
const scale = getSharedScale([coldTrace, warmTrace]);

function names(rows: ReturnType<typeof buildWaterfall>, skipped: boolean) {
  return rows.filter((row) => row.skipped === skipped).map((row) => row.name);
}

describe("measurementToTrace", () => {
  it("roots every stage under the client request span", () => {
    const root = getRootSpan(coldTrace);
    expect(root).toMatchObject({ name: "GET /api/home", kind: "CLIENT" });
    expect(root?.attributes).toMatchObject({
      "http.response.status_code": 200,
      "vercel.cache": "MISS",
    });
    expect(coldTrace.spans.every((span) => span.traceId === "cold")).toBe(true);
  });

  it("nests the server stages in the wait, centered in it", () => {
    const content = coldTrace.spans.find((span) => span.name === "content");
    expect(content).toMatchObject({ kind: "SERVER", parentSpanId: "ttfb" });
    // (100 ms wait - 3 ms of server) / 2 after requestStart.
    expect(content?.startTimeUnixNano).toBe(200.5e6);
  });

  it("leaves out the server stages when the CDN answered", () => {
    expect(warmTrace.spans.some((span) => span.kind === "SERVER")).toBe(false);
  });

  it("keeps the server stages where there is no CDN", () => {
    const local = measurementToTrace({ ...cold, vercelCache: null });
    expect(getRootSpan(local)?.attributes["vercel.cache"]).toBeUndefined();
    expect(local.spans.filter((span) => span.kind === "SERVER")).toHaveLength(2);
  });

  it("converts to Unix nanoseconds from the time origin", () => {
    const traced = measurementToTrace({ ...cold, timeOrigin: 1_000 });
    expect(getRootSpan(traced)?.startTimeUnixNano).toBe(1_100e6);
  });
});

describe("buildWaterfall", () => {
  it("lists every stage in order, with its real duration", () => {
    const rows = buildWaterfall(coldTrace, traceStages, scale);
    expect(rows.map((row) => row.name)).toEqual(traceStages.map((stage) => stage.name));
    expect(names(rows, true)).toEqual([]);
    expect(rows.find((row) => row.name === "ttfb")).toMatchObject({
      kind: "network",
      durationMs: 100,
    });
    expect(rows.find((row) => row.name === "serialize")).toMatchObject({
      kind: "server",
      durationMs: 1,
    });
  });

  it("places bars as fractions of the shared scale", () => {
    const ttfb = buildWaterfall(coldTrace, traceStages, scale).find((row) => row.name === "ttfb");
    expect(ttfb?.start).toBeCloseTo(52 / 162);
    expect(ttfb?.width).toBeCloseTo(100 / 162);
  });

  it("marks reused connection and CDN-served stages as skipped, with their own labels", () => {
    const rows = buildWaterfall(warmTrace, traceStages, scale);
    expect(names(rows, true)).toEqual(["dns", "tcp", "tls", "content", "serialize"]);
    expect(rows.find((row) => row.name === "tcp")?.skippedLabel).toBe("Reusada");
    expect(rows.find((row) => row.name === "content")?.skippedLabel).toBe("Pulado");
  });
});

describe("summarizeTrace", () => {
  it("reports real totals and the CDN state", () => {
    expect(summarizeTrace(coldTrace, scale)).toEqual({
      end: 1,
      statusCode: 200,
      totalMs: 162,
      serverMs: 3,
      cache: "MISS",
    });
  });

  it("has no server time on a CDN hit, and the warm run reads as a fraction of the cold one", () => {
    expect(summarizeTrace(warmTrace, scale)).toMatchObject({
      end: 35 / 162,
      totalMs: 35,
      serverMs: null,
      cache: "HIT",
    });
  });
});

describe("formatDuration", () => {
  it("keeps one decimal below 10 ms and none above", () => {
    expect(formatDuration(0.02)).toBe("<0,1 ms");
    expect(formatDuration(2.46)).toBe("2,5 ms");
    expect(formatDuration(123.4)).toBe("123 ms");
  });
});

describe("describeTraceResult", () => {
  it("announces the measured values", () => {
    expect(
      describeTraceResult({ totalMs: 162, serverMs: 3, cache: "MISS", isRecorded: false }),
    ).toBe("Requisição concluída em 162 ms: servidor 3 ms, cache da CDN MISS.");
  });

  it("says when the values are a recording and there is no CDN", () => {
    expect(
      describeTraceResult({ totalMs: 35, serverMs: null, cache: null, isRecorded: true }),
    ).toBe("Gravação: requisição concluída em 35 ms: servidor pulado pela CDN, sem cache de CDN.");
  });
});
