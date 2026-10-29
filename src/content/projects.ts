export type ProjectStatus = "producao" | "construcao" | "pesquisa" | "demonstracao";

export const projectStatusLabel: Record<ProjectStatus, string> = {
  producao: "Em produção",
  construcao: "Em construção",
  pesquisa: "Pesquisa",
  demonstracao: "Demonstração",
};

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  /** Appended to the status label, e.g. the research program. */
  statusNote?: string;
  /** Final route of the case page, or an external URL (e.g. a live demo) until one exists. */
  route: string;
  /** False until `route` leads somewhere; links then point to `#`. */
  isPublished: boolean;
  /** False keeps the project out of the work list until it exists, without losing its copy. */
  isListed: boolean;
  description: string;
  /** At most four. */
  tags: readonly string[];
}

export const projects = [
  {
    id: "cosmo",
    name: "Cosmo",
    status: "producao",
    route: "/projetos/cosmo",
    isPublished: true,
    isListed: true,
    description:
      "Plataforma de questões de programação construída do zero com a equipe do laboratório, de monólito a microsserviços em Node e TypeScript com Clean Architecture e PostgreSQL. Cada tentativa dos alunos vira dado de aprendizagem.",
    tags: ["Node", "TypeScript", "PostgreSQL", "Clean Architecture"],
  },
  {
    id: "agentes",
    name: "Agentes tutores",
    status: "pesquisa",
    statusNote: "PIBIC",
    route: "/projetos/agentes",
    isPublished: true,
    isListed: true,
    description:
      "Agentes de IA que orientam alunos em exercícios de Python, orquestrados com LangGraph e servidos por FastAPI, com um cache por similaridade que recuperou 96,85% dos erros em dados reais.",
    tags: ["LangGraph", "FastAPI", "Qwen", "Python"],
  },
  {
    id: "meridiano",
    name: "Meridiano",
    status: "demonstracao",
    route: "/projetos/meridiano",
    isPublished: true,
    isListed: true,
    description:
      "Motor de decisão em Python e API em FastAPI que calculam a viagem mais justa para um grupo, com o orçamento de cada pessoa protegido por testes. O texto livre vira restrições estruturadas, avaliadas num conjunto de teste próprio, e quem decide é o motor.",
    tags: ["Python", "FastAPI", "PostgreSQL", "LLM"],
  },
  {
    id: "gallifrey",
    name: "Gallifrey",
    status: "producao",
    route: "/projetos/gallifrey",
    isPublished: true,
    isListed: true,
    description:
      "Microsserviço de missões de Python do Cosmo, levado do protótipo à produção, com questões classificadas pela taxonomia de Bloom para acompanhar o progresso dos alunos.",
    tags: ["TypeScript", "Prisma", "PostgreSQL"],
  },
  {
    id: "recomendacao",
    name: "Recomendação sequencial",
    status: "pesquisa",
    route: "/projetos/recomendacao",
    isPublished: true,
    isListed: true,
    description:
      "Pesquisa de recomendação educacional que combina BERT4Rec e metaheurísticas para montar trilhas de estudo, treinada com dados do Codeforces e de alunos da UFMA.",
    tags: ["BERT4Rec", "Python", "Pandas"],
  },
  {
    id: "documento-sinal",
    name: "Documento → sinal",
    status: "construcao",
    route: "/projetos/documento-sinal",
    isPublished: false,
    isListed: false,
    description:
      "Pipeline que recebe documentos da CVM, extrai fatos relevantes de FIIs com Gemini em saída estruturada e entrega o resultado validado por API. A extração é medida campo a campo contra um gabarito.",
    tags: ["Gemini", "FastAPI", "fila", "eval"],
  },
] as const satisfies readonly Project[];

export const unpublishedHref = "#";

/** In the order of the work list. */
export const listedProjects = projects.filter((project) => project.isListed);

export function getProjectHref(project: Project): string {
  return project.isPublished ? project.route : unpublishedHref;
}

export function projectStatusText(project: Pick<Project, "status" | "statusNote">): string {
  const label = projectStatusLabel[project.status];
  return project.statusNote ? `${label} · ${project.statusNote}` : label;
}

/** Route of a project's page while it is published; null otherwise. */
export function getPublishedRoute(id: string): string | null {
  const project: Project | undefined = projects.find((candidate) => candidate.id === id);
  return project?.isPublished ? project.route : null;
}

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href);
}

/** Routes of published project pages on this site (external demos excluded). */
export function getPublishedProjectPaths(): string[] {
  return projects
    .filter((project) => project.isPublished && !isExternalHref(project.route))
    .map((project) => project.route);
}
