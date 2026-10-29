import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { homeContent } from "@/content/home";
import { listedProjects } from "@/content/projects";
import { coldCacheControl, homeApiUrl, warmCacheControl } from "@/lib/homeApi";
import { formatServerTiming, parseServerTiming } from "@/lib/serverTiming";
import { GET } from "./route";

const base = "https://example.com";

function get(url: URL) {
  return GET(new NextRequest(url));
}

describe("GET /api/home", () => {
  it("serves the Home copy with a short CDN cache", async () => {
    const response = get(homeApiUrl(base, null));
    const body = await response.json();

    expect(body.hero.intro).toBe(homeContent.hero.intro);
    expect(body.projects.map((project: { id: string }) => project.id)).toEqual(
      listedProjects.map((project) => project.id),
    );
    expect(response.headers.get("cache-control")).toBe(warmCacheControl);
    expect(response.headers.get("timing-allow-origin")).toBe("*");
  });

  it("opts out of every cache when the URL is busted", () => {
    const response = get(homeApiUrl(base, "123"));
    expect(response.headers.get("cache-control")).toBe(coldCacheControl);
  });

  it("reports the content and serialize stages in Server-Timing", () => {
    const timing = parseServerTiming(get(homeApiUrl(base, null)).headers.get("server-timing"));
    expect(timing.map((entry) => entry.name)).toEqual(["content", "serialize"]);
    expect(timing.every((entry) => entry.dur >= 0)).toBe(true);
  });
});

describe("Server-Timing", () => {
  it("round-trips and ignores entries without a duration", () => {
    const header = formatServerTiming([{ name: "content", dur: 1.23456 }]);
    expect(header).toBe("content;dur=1.235");
    expect(parseServerTiming(`${header}, cdn-cache;desc=HIT`)).toEqual([
      { name: "content", dur: 1.235 },
    ]);
    expect(parseServerTiming(null)).toEqual([]);
  });
});
