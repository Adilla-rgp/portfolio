import { describe, expect, it } from "vitest";
import { simulatedTraces, traceStages } from "@/content/trace";
import { buildWaterfall, getRootSpan, getSharedScale, summarizeTrace } from "@/lib/trace";

const { frio, quente } = simulatedTraces;
const scale = getSharedScale([frio, quente]);

describe("getRootSpan", () => {
  it("returns the span without a parent", () => {
    expect(getRootSpan(frio)?.name).toBe("edge");
  });
});

describe("getSharedScale", () => {
  it("uses the longest root span, so the warm trace reads as a fraction of the cold one", () => {
    expect(scale).toBe(100);
  });
});

describe("buildWaterfall", () => {
  it("lists every stage in order", () => {
    const rows = buildWaterfall(frio, traceStages, scale);
    expect(rows.map((row) => row.name)).toEqual(traceStages.map((stage) => stage.name));
  });

  it("places bars as fractions of the shared scale", () => {
    const db = buildWaterfall(frio, traceStages, scale).find((row) => row.name === "db.query");
    expect(db).toMatchObject({ kind: "db", skipped: false, start: 0.15, width: 0.47 });
    expect(db?.end).toBeCloseTo(0.62);
  });

  it("marks the database stage as skipped on a warm cache", () => {
    const rows = buildWaterfall(quente, traceStages, scale);
    expect(rows.find((row) => row.name === "db.query")?.skipped).toBe(true);
    expect(rows.find((row) => row.name === "cache.get")).toMatchObject({
      kind: "cache",
      cacheHit: true,
    });
  });
});

describe("summarizeTrace", () => {
  it("counts a miss and one query on a cold cache", () => {
    expect(summarizeTrace(frio, scale)).toEqual({
      end: 1,
      statusCode: 200,
      dbQueries: 1,
      cacheHit: false,
    });
  });

  it("counts a hit and no queries on a warm cache", () => {
    expect(summarizeTrace(quente, scale)).toMatchObject({
      end: 0.34,
      dbQueries: 0,
      cacheHit: true,
    });
  });
});
