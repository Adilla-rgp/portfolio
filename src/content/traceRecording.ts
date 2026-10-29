import type { TraceMode } from "@/content/trace";
import type { RecordedTrace } from "@/lib/measureHomeRequest";

/**
 * Real runs of the trace demo, captured from a browser against production
 * (byadilla.vercel.app). Shown, labeled as a recording, only when the live request fails and this
 * browser has no run of its own stored.
 */
export const recordedTraces: Record<TraceMode, RecordedTrace> = {
  "frio": {
    "trace": {
      "traceId": "c4db0729e2d9482ca97cbb218700991e",
      "name": "GET /api/home",
      "spans": [
        {
          "traceId": "c4db0729e2d9482ca97cbb218700991e",
          "spanId": "root",
          "name": "GET /api/home",
          "kind": "CLIENT",
          "startTimeUnixNano": 1793288856920100000,
          "endTimeUnixNano": 1793288857210000000,
          "attributes": {
            "service.name": "Navegador",
            "http.response.status_code": 200,
            "vercel.cache": "MISS"
          },
          "status": {
            "code": "OK"
          }
        },
        {
          "traceId": "c4db0729e2d9482ca97cbb218700991e",
          "spanId": "ttfb",
          "parentSpanId": "root",
          "name": "ttfb",
          "kind": "CLIENT",
          "startTimeUnixNano": 1793288856922200300,
          "endTimeUnixNano": 1793288857208000000,
          "attributes": {
            "service.name": "Rede + servidor"
          },
          "status": {
            "code": "OK"
          }
        },
        {
          "traceId": "c4db0729e2d9482ca97cbb218700991e",
          "spanId": "content",
          "parentSpanId": "ttfb",
          "name": "content",
          "kind": "SERVER",
          "startTimeUnixNano": 1793288857065063000,
          "endTimeUnixNano": 1793288857065110000,
          "attributes": {
            "service.name": "Next.js"
          },
          "status": {
            "code": "OK"
          }
        },
        {
          "traceId": "c4db0729e2d9482ca97cbb218700991e",
          "spanId": "serialize",
          "parentSpanId": "ttfb",
          "name": "serialize",
          "kind": "SERVER",
          "startTimeUnixNano": 1793288857065110000,
          "endTimeUnixNano": 1793288857065137200,
          "attributes": {
            "service.name": "Next.js"
          },
          "status": {
            "code": "OK"
          }
        },
        {
          "traceId": "c4db0729e2d9482ca97cbb218700991e",
          "spanId": "download",
          "parentSpanId": "root",
          "name": "download",
          "kind": "INTERNAL",
          "startTimeUnixNano": 1793288857208000000,
          "endTimeUnixNano": 1793288857210000000,
          "attributes": {
            "service.name": "Rede"
          },
          "status": {
            "code": "OK"
          }
        }
      ]
    },
    "recordedAt": "2026-10-29T15:47:37.214Z"
  },
  "quente": {
    "trace": {
      "traceId": "8a66d344e8e74157896544e46919dbd0",
      "name": "GET /api/home",
      "spans": [
        {
          "traceId": "8a66d344e8e74157896544e46919dbd0",
          "spanId": "root",
          "name": "GET /api/home",
          "kind": "CLIENT",
          "startTimeUnixNano": 1793288863600700200,
          "endTimeUnixNano": 1793288863654800100,
          "attributes": {
            "service.name": "Navegador",
            "http.response.status_code": 200,
            "vercel.cache": "HIT"
          },
          "status": {
            "code": "OK"
          }
        },
        {
          "traceId": "8a66d344e8e74157896544e46919dbd0",
          "spanId": "ttfb",
          "parentSpanId": "root",
          "name": "ttfb",
          "kind": "CLIENT",
          "startTimeUnixNano": 1793288863602400300,
          "endTimeUnixNano": 1793288863653200100,
          "attributes": {
            "service.name": "Rede + servidor"
          },
          "status": {
            "code": "OK"
          }
        },
        {
          "traceId": "8a66d344e8e74157896544e46919dbd0",
          "spanId": "download",
          "parentSpanId": "root",
          "name": "download",
          "kind": "INTERNAL",
          "startTimeUnixNano": 1793288863653200100,
          "endTimeUnixNano": 1793288863654800100,
          "attributes": {
            "service.name": "Rede"
          },
          "status": {
            "code": "OK"
          }
        }
      ]
    },
    "recordedAt": "2026-10-29T15:47:43.656Z"
  }
};
