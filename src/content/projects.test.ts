import { describe, expect, it } from "vitest";
import { lenses } from "@/content/lens";
import { getPublishedProjectPaths, listedProjects, projects } from "@/content/projects";

describe("work list order", () => {
  it.each(lenses)("gives each listed project its own position in the /%s lens", (lens) => {
    const positions = listedProjects.map((project) => project.order[lens]);
    expect(new Set(positions).size).toBe(positions.length);
  });
});

describe("getPublishedProjectPaths", () => {
  it("returns only published pages hosted on this site", () => {
    const paths = getPublishedProjectPaths();
    const unpublished = projects
      .filter((project) => !project.isPublished)
      .map((project): string => project.route);
    expect(paths.every((path) => path.startsWith("/"))).toBe(true);
    expect(paths.some((path) => unpublished.includes(path))).toBe(false);
  });
});
