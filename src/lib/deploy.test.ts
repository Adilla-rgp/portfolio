import { afterEach, describe, expect, it, vi } from "vitest";
import { getDeployId } from "@/lib/deploy";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getDeployId", () => {
  it("shortens the Vercel commit to 7 characters", () => {
    vi.stubEnv("VERCEL_GIT_COMMIT_SHA", "34a6ba5e1f0c2d9b");
    expect(getDeployId("local")).toBe("34a6ba5");
  });

  it("falls back outside Vercel", () => {
    vi.stubEnv("VERCEL_GIT_COMMIT_SHA", "");
    expect(getDeployId("local")).toBe("local");
  });
});
