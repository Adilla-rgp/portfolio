import { describe, expect, it } from "vitest";
import { buildAffinity, maskedPositions, predictNext, tokenRole } from "@/lib/toyRecommender";

const affinity = buildAffinity(8, [[3, 7]]);

describe("buildAffinity", () => {
  it("pulls hardest toward the next topic and never toward itself", () => {
    expect(affinity[0][0]).toBe(0);
    expect(affinity[0][1]).toBeGreaterThan(affinity[0][2]);
    expect(affinity[1][0]).toBeLessThan(affinity[0][1]);
  });

  it("adds the thematic pull", () => {
    expect(affinity[3][7]).toBeGreaterThan(affinity[2][7]);
  });
});

describe("predictNext", () => {
  it("ranks unseen topics into a probability distribution", () => {
    const { ranked } = predictNext([0, 1, 2], affinity);
    expect(ranked.map((prediction) => prediction.item)).not.toContain(0);
    expect(ranked.reduce((sum, prediction) => sum + prediction.probability, 0)).toBeCloseTo(1);
    expect(ranked[0].item).toBe(3);
  });

  it("spreads attention over the sequence, favoring recent items", () => {
    const { attention } = predictNext([0, 1, 2], affinity);
    expect(attention.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1);
    expect(attention[2]).toBeGreaterThan(attention[0]);
  });

  it("returns nothing to rank for an empty sequence's attention", () => {
    expect(predictNext([], affinity).attention).toEqual([]);
  });
});

describe("maskedPositions", () => {
  it("always hides two distinct positions inside the sequence", () => {
    for (let step = 0; step < 40; step += 1) {
      const [a, b] = maskedPositions(step, 8);
      expect(a).not.toBe(b);
      expect([a, b].every((position) => position >= 0 && position < 8)).toBe(true);
    }
  });
});

describe("tokenRole", () => {
  it("uses both sides when bidirectional and only the left otherwise", () => {
    expect(tokenRole(2, [2, 5], true)).toBe("masked");
    expect(tokenRole(7, [2, 5], true)).toBe("used");
    expect(tokenRole(1, [2, 5], false)).toBe("used");
    expect(tokenRole(3, [2, 5], false)).toBe("ignored");
  });
});
