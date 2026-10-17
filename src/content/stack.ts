export interface StackProject {
  id: string;
  label: string;
  sub: string;
}

export interface StackTech {
  name: string;
  /** Ids of the projects where this technology was used. */
  usedIn: readonly string[];
}

export const stackContent = {
  techsLabel: "Tecnologias",
  projectsLabel: "Projetos",
  /** Screen-reader summary of the current selection. */
  describeTech: (tech: string, projects: readonly string[]) =>
    `${tech}: usada em ${projects.join(", ")}.`,
  describeProject: (project: string, techs: readonly string[]) =>
    `${project}: feito com ${techs.join(", ")}.`,
} as const;

export const stackProjects = [
  { id: "cosmo", label: "Cosmo", sub: "Tutor com IA" },
  { id: "gallifrey", label: "Gallifrey", sub: "Missões" },
  { id: "documento-sinal", label: "Documento → sinal", sub: "Extração com LLM" },
  { id: "recomendacao", label: "Recomendação", sub: "Pesquisa" },
  { id: "bi", label: "Análise & BI", sub: "[Onde usou]" },
] as const satisfies readonly StackProject[];

export const stackTechs = [
  { name: "Python", usedIn: ["cosmo", "documento-sinal", "recomendacao"] },
  { name: "TypeScript", usedIn: ["cosmo", "gallifrey"] },
  { name: "FastAPI", usedIn: ["cosmo", "documento-sinal"] },
  { name: "LangGraph", usedIn: ["cosmo"] },
  { name: "API do Claude", usedIn: ["cosmo"] },
  { name: "Gemini", usedIn: ["documento-sinal"] },
  { name: "PostgreSQL", usedIn: ["cosmo", "gallifrey"] },
  { name: "Prisma", usedIn: ["gallifrey"] },
  { name: "Next.js", usedIn: ["cosmo"] },
  { name: "React", usedIn: ["gallifrey"] },
  { name: "Pandas", usedIn: ["recomendacao"] },
  { name: "SQL", usedIn: ["bi", "cosmo"] },
  { name: "dbt", usedIn: ["bi"] },
  { name: "Power BI", usedIn: ["bi"] },
] as const satisfies readonly StackTech[];

export type StackSelection =
  | { kind: "tech"; id: string }
  | { kind: "project"; id: string };

export const initialStackSelection: StackSelection = { kind: "tech", id: "Python" };
