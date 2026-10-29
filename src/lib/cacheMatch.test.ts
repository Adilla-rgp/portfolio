import { describe, expect, it } from "vitest";
import { cachePresets, cacheSetup } from "@/content/cache";
import { jaccard, matchCache, parseExpectedGot, tokenize, triagePasses, uniqueTokens } from "@/lib/cacheMatch";

const { threshold } = cacheSetup;

describe("tokenize", () => {
  it("lowercases and splits on anything that is not a letter or a number", () => {
    expect(tokenize("NameError: name 'total' is not defined")).toEqual([
      "nameerror",
      "name",
      "total",
      "is",
      "not",
      "defined",
    ]);
  });

  it("keeps accented letters and digits inside tokens", () => {
    expect(tokenize("Função f(x2) — linha 10!")).toEqual(["função", "f", "x2", "linha", "10"]);
  });

  it("returns nothing for blank or punctuation-only text", () => {
    expect(tokenize("  ...:  ")).toEqual([]);
  });

  it("drops repeats in order of first appearance for the chips", () => {
    expect(uniqueTokens("str to str to int")).toEqual(["str", "to", "int"]);
  });
});

describe("jaccard", () => {
  it("divides shared tokens by the union of both sets", () => {
    expect(jaccard("a b c", "b c d")).toEqual({ shared: 2, union: 4, similarity: 0.5 });
  });

  it("ignores order and repetition", () => {
    expect(jaccard("expected false got true", "Expected True got False").similarity).toBe(1);
    expect(jaccard("a a b", "b a").similarity).toBe(1);
  });

  it("is 0 when both texts are empty", () => {
    expect(jaccard("", "").similarity).toBe(0);
  });
});

describe("triage", () => {
  it("reads the values after Expected and Got", () => {
    expect(parseExpectedGot("AssertionError: expected 15, got 12")).toEqual({
      expected: "15",
      got: "12",
    });
  });

  it("does not apply unless both messages carry Expected and Got", () => {
    expect(parseExpectedGot("got 3 expected 4")).toBeNull();
    expect(triagePasses("Expected 1 got 2", "NameError: name 'x' is not defined")).toBeNull();
  });

  it("fails when either field differs and passes when both match", () => {
    expect(triagePasses("Expected False got True", "Expected True got False")).toBe(false);
    expect(triagePasses("Expected 3 got 4", "expected: 3, got: 4")).toBe(true);
  });

  it("turns a similarity hit into a rejection only when switched on", () => {
    const input = { incoming: "Expected False got True", cached: "Expected True got False", threshold };
    expect(matchCache({ ...input, triage: true }).verdict).toBe("rejected");
    expect(matchCache({ ...input, triage: false }).verdict).toBe("similar");
  });
});

describe("presets", () => {
  const preset = (id: string) => {
    const found = cachePresets.find((item) => item.id === id);
    if (!found) throw new Error(`missing preset ${id}`);
    return found;
  };
  const match = (id: string, triage = true) => {
    const { incoming, cached } = preset(id);
    return matchCache({ incoming, cached, threshold, triage });
  };

  it("identical messages are an exact hit", () => {
    expect(match("identicas")).toMatchObject({ verdict: "exact", similarity: 1 });
  });

  it("similar messages land between 0,86 and 0,95 and hit by similarity", () => {
    const result = match("parecidas");
    expect(result.similarity).toBeGreaterThanOrEqual(0.86);
    expect(result.similarity).toBeLessThanOrEqual(0.95);
    expect(result.verdict).toBe("similar");
  });

  it("different messages fall below the threshold", () => {
    const result = match("diferentes");
    expect(result.similarity).toBeLessThan(threshold);
    expect(result.verdict).toBe("miss");
  });

  it("swapped Expected/Got ties at 1,0 and only the triage stops it", () => {
    expect(match("invertida")).toMatchObject({ similarity: 1, verdict: "rejected" });
    expect(match("invertida", false).verdict).toBe("similar");
  });
});
