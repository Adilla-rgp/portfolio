export interface StackProject {
  id: string;
  label: string;
  sub: string;
  /** Short add-on shown under the name, e.g. "+ dashboards de aprendizagem". */
  feature?: string;
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

const learningDashboards = "+ dashboards de aprendizagem";

export const stackProjects = [
  { id: "meridiano", label: "Meridiano", sub: "Viagens em grupo" },
  {
    id: "cosmo",
    label: "Cosmo",
    sub: "Questões de programação",
    feature: learningDashboards,
  },
  { id: "agentes", label: "Agentes tutores", sub: "Tutores com IA" },
  { id: "gallifrey", label: "Gallifrey", sub: "Missões", feature: learningDashboards },
  { id: "documento-sinal", label: "Documento → sinal", sub: "Extração com LLM" },
  { id: "recomendacao", label: "Recomendação", sub: "Pesquisa" },
  { id: "histoclick", label: "Histoclick", sub: "App mobile" },
] as const satisfies readonly StackProject[];

export const stackTechs = [
  { name: "Python", usedIn: ["agentes", "recomendacao", "documento-sinal", "meridiano"] },
  { name: "TypeScript", usedIn: ["cosmo", "meridiano", "histoclick"] },
  { name: "FastAPI", usedIn: ["agentes", "documento-sinal", "meridiano"] },
  { name: "LangGraph", usedIn: ["agentes"] },
  { name: "Qwen", usedIn: ["agentes"] },
  { name: "Gemini", usedIn: ["documento-sinal"] },
  { name: "PostgreSQL", usedIn: ["cosmo", "meridiano"] },
  { name: "Prisma", usedIn: ["cosmo"] },
  { name: "Next.js", usedIn: ["cosmo"] },
  { name: "React", usedIn: ["gallifrey", "meridiano", "histoclick"] },
  { name: "React Native", usedIn: ["histoclick"] },
  { name: "Expo", usedIn: ["histoclick"] },
  { name: "Supabase", usedIn: ["histoclick"] },
  { name: "Pandas", usedIn: ["recomendacao"] },
  { name: "SQL", usedIn: ["cosmo", "gallifrey", "agentes"] },
  { name: "dbt", usedIn: ["cosmo", "gallifrey", "recomendacao"] },
  { name: "Power BI", usedIn: ["cosmo", "gallifrey", "recomendacao"] },
] as const satisfies readonly StackTech[];

export type StackSelection =
  | { kind: "tech"; id: string }
  | { kind: "project"; id: string };

export const initialStackSelection: StackSelection = { kind: "tech", id: "Python" };
