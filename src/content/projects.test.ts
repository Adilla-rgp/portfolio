import { describe, expect, it } from "vitest";
import { getPublishedProjectPaths, listedProjects, projects } from "@/content/projects";

const MAX_TAGS = 4;

describe("work list", () => {
  it("lists the projects in the order of the Home", () => {
    expect(listedProjects.map((project) => project.id)).toEqual([
      "cosmo",
      "agentes",
      "meridiano",
      "gallifrey",
      "recomendacao",
      "histoclick",
    ]);
  });

  it.each(projects.map((project) => [project.id, project] as const))(
    "%s has one description and at most four tags",
    (_, project) => {
      expect(project.description.length).toBeGreaterThan(0);
      expect(project.tags.length).toBeLessThanOrEqual(MAX_TAGS);
    },
  );
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

  it("puts the Histoclick case in the sitemap", () => {
    expect(getPublishedProjectPaths()).toContain("/projetos/histoclick");
  });
});
