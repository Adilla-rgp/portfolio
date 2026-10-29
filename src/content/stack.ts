export interface StackProject {
  id: string;
  label: string;
  sub: string;
  /** Short description, for work that has no page of its own. */
  body?: string;
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
  { id: "meridiano", label: "Meridiano", sub: "Viagens em grupo" },
  { id: "cosmo", label: "Cosmo", sub: "Questões de programação" },
  { id: "agentes", label: "Agentes tutores", sub: "Tutores com IA" },
  { id: "gallifrey", label: "Gallifrey", sub: "Missões" },
  { id: "documento-sinal", label: "Documento → sinal", sub: "Extração com LLM" },
  { id: "recomendacao", label: "Recomendação", sub: "Pesquisa" },
  {
    id: "dashboards",
    label: "Dashboards de aprendizagem",
    sub: "Power BI · dbt",
    body: "Dashboards para professores acompanharem o aprendizado dos alunos num sistema de sala de aula, e análise de métricas nas pesquisas.",
  },
] as const satisfies readonly StackProject[];

export const stackTechs = [
  { name: "Python", usedIn: ["agentes", "recomendacao", "documento-sinal", "meridiano"] },
  { name: "TypeScript", usedIn: ["cosmo", "meridiano"] },
  { name: "FastAPI", usedIn: ["agentes", "documento-sinal", "meridiano"] },
  { name: "LangGraph", usedIn: ["agentes"] },
  { name: "Qwen", usedIn: ["agentes"] },
  { name: "Gemini", usedIn: ["documento-sinal"] },
  { name: "PostgreSQL", usedIn: ["cosmo", "meridiano"] },
  { name: "Prisma", usedIn: ["cosmo"] },
  { name: "Next.js", usedIn: ["cosmo"] },
  { name: "React", usedIn: ["gallifrey", "meridiano"] },
  { name: "Pandas", usedIn: ["recomendacao"] },
  { name: "SQL", usedIn: ["cosmo", "dashboards"] },
  { name: "dbt", usedIn: ["dashboards", "recomendacao"] },
  { name: "Power BI", usedIn: ["dashboards", "recomendacao"] },
] as const satisfies readonly StackTech[];

export type StackSelection =
  | { kind: "tech"; id: string }
  | { kind: "project"; id: string };

export const initialStackSelection: StackSelection = { kind: "tech", id: "Python" };
