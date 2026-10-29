import { describe, expect, it } from "vitest";
import { stackProjects, stackTechs } from "@/content/stack";
import { getStackLinks } from "@/lib/stackMap";
import { visibleStack } from "@/lib/stackMap";

describe("stack map content", () => {
  const usedIn = (name: string) => stackTechs.find((tech) => tech.name === name)?.usedIn;

  it("shows learning dashboards as a feature of Cosmo and Gallifrey, not as a node", () => {
    expect(stackProjects.map((project) => project.id)).not.toContain("dashboards");
    const withFeature = stackProjects.filter((project) => "feature" in project);
    expect(withFeature.map((project) => project.id)).toEqual(["cosmo", "gallifrey"]);
  });

  it("links SQL, dbt and Power BI to the projects that use them", () => {
    expect(usedIn("SQL")).toEqual(["cosmo", "gallifrey", "agentes"]);
    expect(usedIn("dbt")).toEqual(["cosmo", "gallifrey", "recomendacao"]);
    expect(usedIn("Power BI")).toEqual(["cosmo", "gallifrey", "recomendacao"]);
  });

  it("links the mobile stack to Histoclick", () => {
    expect(usedIn("React Native")).toEqual(["histoclick"]);
    expect(usedIn("Expo")).toEqual(["histoclick"]);
    expect(usedIn("TypeScript")).toContain("histoclick");
    expect(usedIn("React")).toContain("histoclick");
  });

  it("only links to projects on the map", () => {
    const ids = stackProjects.map((project): string => project.id);
    expect(getStackLinks(stackTechs).every((link) => ids.includes(link.project))).toBe(true);
  });
});

describe("visibleStack", () => {
  const { techs, projects } = visibleStack(stackTechs, stackProjects, ["documento-sinal"]);

  it("removes the hidden project and every link to it", () => {
    expect(projects.map((project) => project.id)).not.toContain("documento-sinal");
    expect(techs.some((tech) => tech.usedIn.includes("documento-sinal"))).toBe(false);
  });

  it("drops technologies used only by hidden projects", () => {
    expect(techs.map((tech) => tech.name)).not.toContain("Gemini");
    expect(techs.map((tech) => tech.name)).toContain("Python");
  });
});
