import type { NextRequest } from "next/server";
import { lensParam } from "@/content/lens";
import {
  buildHomePayload,
  cacheBustParam,
  coldCacheControl,
  serverStages,
  warmCacheControl,
} from "@/lib/homeApi";
import { parseLens } from "@/lib/lens";
import { formatServerTiming } from "@/lib/serverTiming";

/**
 * The Home copy for the requested lens, timed stage by stage. The trace demo
 * on the Home calls it and reads the Server-Timing header; a cache-busting
 * query opts out of the CDN cache for the cold run.
 */
export function GET(request: NextRequest): Response {
  const { searchParams } = request.nextUrl;

  const contentStart = performance.now();
  const payload = buildHomePayload(parseLens(searchParams.get(lensParam) ?? undefined));
  const serializeStart = performance.now();
  const body = JSON.stringify(payload);
  const end = performance.now();

  return new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": searchParams.has(cacheBustParam) ? coldCacheControl : warmCacheControl,
      "Server-Timing": formatServerTiming([
        { name: serverStages.content, dur: serializeStart - contentStart },
        { name: serverStages.serialize, dur: end - serializeStart },
      ]),
      // Lets the browser expose the full Resource Timing breakdown to the page.
      "Timing-Allow-Origin": "*",
    },
  });
}
