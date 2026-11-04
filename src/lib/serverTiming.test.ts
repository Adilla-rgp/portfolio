import { describe, expect, it } from "vitest";
import { formatServerTiming, parseServerTiming } from "@/lib/serverTiming";

describe("formatServerTiming", () => {
  it("joins entries with fixed precision", () => {
    expect(
      formatServerTiming([
        { name: "db", dur: 12.34567 },
        { name: "render", dur: 0.5 },
      ]),
    ).toBe("db;dur=12.346, render;dur=0.500");
  });

  it("returns an empty string for no entries", () => {
    expect(formatServerTiming([])).toBe("");
  });
});

describe("parseServerTiming", () => {
  it("returns nothing for a missing or empty header", () => {
    expect(parseServerTiming(null)).toEqual([]);
    expect(parseServerTiming("")).toEqual([]);
  });

  it("reads dur regardless of param order and whitespace", () => {
    expect(parseServerTiming(' db ; desc="Query" ; dur=1.2 ,cache;dur=0')).toEqual([
      { name: "db", dur: 1.2 },
      { name: "cache", dur: 0 },
    ]);
  });

  it("drops entries without a valid dur", () => {
    expect(parseServerTiming("miss, bad;dur=abc, ;dur=3, ok;dur=4")).toEqual([{ name: "ok", dur: 4 }]);
  });

  it("round-trips what formatServerTiming writes", () => {
    const entries = [
      { name: "db", dur: 1.5 },
      { name: "render", dur: 0.25 },
    ];
    expect(parseServerTiming(formatServerTiming(entries))).toEqual(entries);
  });
});
