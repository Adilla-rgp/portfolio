import type { TraceMode } from "@/content/trace";
import type { RecordedTrace } from "@/lib/measureHomeRequest";

/**
 * Real runs of the trace demo, captured from a browser against the local
 * production build (next start). Shown, labeled as a recording, only when the live request fails and this
 * browser has no run of its own stored.
 */
export const recordedTraces: Record<TraceMode, RecordedTrace> = {
  "frio": {
    "trace": {
      "traceId": "3668f8a9750e44e7944c92aeef2fdcfe",
      "name": "GET /api/home",
      "spans": [
        {
          "traceId": "3668f8a9750e44e7944c92aeef2fdcfe",
          "spanId": "root",
          "name": "GET /api/home",
          "kind": "CLIENT",
          "startTimeUnixNano": 1793288056983600000,
          "endTimeUnixNano": 1793288056990600200,
          "attributes": {
            "service.name": "Navegador",
            "http.response.status_code": 200
          },
          "status": {
            "code": "OK"
          }
        },
        {
          "traceId": "3668f8a9750e44e7944c92aeef2fdcfe",
          "spanId": "ttfb",
          "parentSpanId": "root",
          "name": "ttfb",
          "kind": "CLIENT",
          "startTimeUnixNano": 1793288056984400100,
          "endTimeUnixNano": 1793288056990300200,
          "attributes": {
            "service.name": "Rede + servidor"
          },
          "status": {
            "code": "OK"
          }
        },
        {
          "traceId": "3668f8a9750e44e7944c92aeef2fdcfe",
          "spanId": "content",
          "parentSpanId": "ttfb",
          "name": "content",
          "kind": "SERVER",
          "startTimeUnixNano": 1793288056987315200,
          "endTimeUnixNano": 1793288056987362000,
          "attributes": {
            "service.name": "Next.js"
          },
          "status": {
            "code": "OK"
          }
        },
        {
          "traceId": "3668f8a9750e44e7944c92aeef2fdcfe",
          "spanId": "serialize",
          "parentSpanId": "ttfb",
          "name": "serialize",
          "kind": "SERVER",
          "startTimeUnixNano": 1793288056987362000,
          "endTimeUnixNano": 1793288056987385000,
          "attributes": {
            "service.name": "Next.js"
          },
          "status": {
            "code": "OK"
          }
        },
        {
          "traceId": "3668f8a9750e44e7944c92aeef2fdcfe",
          "spanId": "download",
          "parentSpanId": "root",
          "name": "download",
          "kind": "INTERNAL",
          "startTimeUnixNano": 1793288056990300200,
          "endTimeUnixNano": 1793288056990600200,
          "attributes": {
            "service.name": "Rede"
          },
          "status": {
            "code": "OK"
          }
        }
      ]
    },
    "recordedAt": "2026-10-29T15:34:16.993Z"
  },
  "quente": {
    "trace": {
      "traceId": "b4faaa2a9c064994b1af77c8926eee51",
      "name": "GET /api/home",
      "spans": [
        {
          "traceId": "b4faaa2a9c064994b1af77c8926eee51",
          "spanId": "root",
          "name": "GET /api/home",
          "kind": "CLIENT",
          "startTimeUnixNano": 1793288061760700200,
          "endTimeUnixNano": 1793288062008600000,
          "attributes": {
            "service.name": "Navegador",
            "http.response.status_code": 200
          },
          "status": {
            "code": "OK"
          }
        },
        {
          "traceId": "b4faaa2a9c064994b1af77c8926eee51",
          "spanId": "ttfb",
          "parentSpanId": "root",
          "name": "ttfb",
          "kind": "CLIENT",
          "startTimeUnixNano": 1793288061763500000,
          "endTimeUnixNano": 1793288062006000000,
          "attributes": {
            "service.name": "Rede + servidor"
          },
          "status": {
            "code": "OK"
          }
        },
        {
          "traceId": "b4faaa2a9c064994b1af77c8926eee51",
          "spanId": "content",
          "parentSpanId": "ttfb",
          "name": "content",
          "kind": "SERVER",
          "startTimeUnixNano": 1793288061884633600,
          "endTimeUnixNano": 1793288061884803600,
          "attributes": {
            "service.name": "Next.js"
          },
          "status": {
            "code": "OK"
          }
        },
        {
          "traceId": "b4faaa2a9c064994b1af77c8926eee51",
          "spanId": "serialize",
          "parentSpanId": "ttfb",
          "name": "serialize",
          "kind": "SERVER",
          "startTimeUnixNano": 1793288061884803600,
          "endTimeUnixNano": 1793288061884866800,
          "attributes": {
            "service.name": "Next.js"
          },
          "status": {
            "code": "OK"
          }
        },
        {
          "traceId": "b4faaa2a9c064994b1af77c8926eee51",
          "spanId": "download",
          "parentSpanId": "root",
          "name": "download",
          "kind": "INTERNAL",
          "startTimeUnixNano": 1793288062006000000,
          "endTimeUnixNano": 1793288062008600000,
          "attributes": {
            "service.name": "Rede"
          },
          "status": {
            "code": "OK"
          }
        }
      ]
    },
    "recordedAt": "2026-10-29T15:34:22.038Z"
  }
};
