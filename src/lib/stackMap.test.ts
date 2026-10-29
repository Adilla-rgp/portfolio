import { describe, expect, it } from "vitest";
import { stackProjects, stackTechs } from "@/content/stack";
import { visibleStack } from "@/lib/stackMap";

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
