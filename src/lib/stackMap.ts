import type { StackProject, StackSelection, StackTech } from "@/content/stack";

export interface StackLink {
  key: string;
  tech: string;
  project: string;
}

export function getStackLinks(techs: readonly StackTech[]): StackLink[] {
  return techs.flatMap((tech) =>
    tech.usedIn.map((project) => ({ key: `${tech.name}→${project}`, tech: tech.name, project })),
  );
}

export function isTechOn(tech: StackTech, selection: StackSelection): boolean {
  return selection.kind === "tech"
    ? selection.id === tech.name
    : tech.usedIn.includes(selection.id);
}

export function isProjectOn(
  project: StackProject,
  selection: StackSelection,
  techs: readonly StackTech[],
): boolean {
  if (selection.kind === "project") return selection.id === project.id;
  return techs.some((tech) => tech.name === selection.id && tech.usedIn.includes(project.id));
}

export function isLinkOn(link: StackLink, selection: StackSelection): boolean {
  return selection.kind === "tech" ? link.tech === selection.id : link.project === selection.id;
}

export function isSameSelection(a: StackSelection, b: StackSelection): boolean {
  return a.kind === b.kind && a.id === b.id;
}

/** Horizontal cubic from (x1, y1) to (x2, y2), bending at the midpoint. */
export function linkPath(x1: number, y1: number, x2: number, y2: number): string {
  const mid = (x1 + x2) / 2;
  return `M${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;
}
