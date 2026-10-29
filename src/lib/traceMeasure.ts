import { traceContent, traceStages, type TraceStageName } from "@/content/trace";
import { serverStages } from "@/lib/homeApi";
import type { ServerTimingEntry } from "@/lib/serverTiming";
import type { Trace, TraceSpan } from "@/types/trace";

/** Resource Timing marks of one request, in ms from the page's time origin. */
export interface ResourceMarks {
  startTime: number;
  domainLookupStart: number;
  domainLookupEnd: number;
  connectStart: number;
  /** 0 when the request did not negotiate TLS. */
  secureConnectionStart: number;
  connectEnd: number;
  requestStart: number;
  responseStart: number;
  responseEnd: number;
}

export interface RequestMeasurement {
  traceId: string;
  /** `performance.timeOrigin`, in ms since the Unix epoch. */
  timeOrigin: number;
  marks: ResourceMarks;
  serverTiming: readonly ServerTimingEntry[];
  /** `x-vercel-cache`; null where there is no Vercel CDN (e.g. localhost). */
  vercelCache: string | null;
  statusCode: number;
}

const NS_PER_MS = 1e6;

/** CDN states in which the function itself ran for this request. */
const SERVER_RAN_ON = ["MISS", "BYPASS"];

function serviceOf(name: TraceStageName): string {
  return traceStages.find((stage) => stage.name === name)?.service ?? "";
}

/** Turns one measured request into OTel-shaped spans for the waterfall. */
export function measurementToTrace(measurement: RequestMeasurement): Trace {
  const { traceId, timeOrigin, marks, serverTiming, vercelCache, statusCode } = measurement;
  const ns = (ms: number) => Math.round((timeOrigin + ms) * NS_PER_MS);
  const rootId = "root";
  const spans: TraceSpan[] = [
    {
      traceId,
      spanId: rootId,
      name: traceContent.rootName,
      kind: "CLIENT",
      startTimeUnixNano: ns(marks.startTime),
      endTimeUnixNano: ns(marks.responseEnd),
      attributes: {
        "service.name": traceContent.rootService,
        "http.response.status_code": statusCode,
        ...(vercelCache !== null && { "vercel.cache": vercelCache }),
      },
      status: { code: "OK" },
    },
  ];

  const add = (
    name: TraceStageName,
    start: number,
    end: number,
    kind: TraceSpan["kind"] = "INTERNAL",
    parentSpanId = rootId,
  ) => {
    if (end <= start) return;
    spans.push({
      traceId,
      spanId: name,
      parentSpanId,
      name,
      kind,
      startTimeUnixNano: ns(start),
      endTimeUnixNano: ns(end),
      attributes: { "service.name": serviceOf(name) },
      status: { code: "OK" },
    });
  };

  const hasTls = marks.secureConnectionStart > 0;
  add("dns", marks.domainLookupStart, marks.domainLookupEnd);
  add("tcp", marks.connectStart, hasTls ? marks.secureConnectionStart : marks.connectEnd);
  if (hasTls) add("tls", marks.secureConnectionStart, marks.connectEnd);
  add("ttfb", marks.requestStart, marks.responseStart, "CLIENT");

  // A CDN hit replays the Server-Timing header cached with the response, so
  // those numbers describe an older run: the server stages count as skipped.
  const serverRan = vercelCache === null || SERVER_RAN_ON.includes(vercelCache);
  const stages = serverRan
    ? [serverStages.content, serverStages.serialize].flatMap((name) => {
        const entry = serverTiming.find((candidate) => candidate.name === name);
        return entry ? [{ name, dur: entry.dur }] : [];
      })
    : [];
  // Server-Timing carries durations only. The server's share of the wait is
  // centered in it, splitting the network time evenly between the two ways.
  const serverTotal = stages.reduce((sum, stage) => sum + stage.dur, 0);
  const wait = marks.responseStart - marks.requestStart;
  let cursor = marks.requestStart + Math.max(0, (wait - serverTotal) / 2);
  for (const stage of stages) {
    add(stage.name, cursor, cursor + stage.dur, "SERVER", "ttfb");
    cursor += stage.dur;
  }

  add("download", marks.responseStart, marks.responseEnd);
  return { traceId, name: traceContent.rootName, spans };
}
