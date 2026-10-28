import type { ByLens } from "@/content/lens";

export type ProjectStatus = "producao" | "construcao" | "pesquisa" | "demonstracao";

export const projectStatusLabel: Record<ProjectStatus, string> = {
  producao: "Em produção",
  construcao: "Em construção",
  pesquisa: "Pesquisa",
  demonstracao: "Demonstração",
};

interface ProjectLensCopy {
  description: string;
  tags: readonly string[];
}

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  /** Final route of the case page, or an external URL (e.g. a live demo) until one exists. */
  route: string;
  /** False until `route` leads somewhere; links then point to `#`. */
  isPublished: boolean;
  /**
   * False keeps the project out of the work list until it exists, without
   * losing its copy or its place in each lens order.
   */
  isListed: boolean;
  /** Position in the work list for each lens (1 = first). */
  order: ByLens<number>;
  copy: ByLens<ProjectLensCopy>;
}

export const projects = [
  {
    id: "meridiano",
    name: "Meridiano",
    status: "demonstracao",
    route: "https://meridiano2.vercel.app",
    isPublished: true,
    isListed: true,
    order: { backend: 1, dados: 1 },
    copy: {
      backend: {
        description:
          "Motor de decisão em Python e API em FastAPI que calculam a viagem mais justa para um grupo, com privacidade de orçamento garantida por testes.",
        tags: ["FastAPI", "PostgreSQL", "SQLAlchemy"],
      },
      dados: {
        description:
          "Texto livre vira restrições estruturadas, com conjunto de avaliação próprio e linha de base publicada; a IA interpreta, o motor decide.",
        tags: ["Python", "LLM", "Avaliação"],
      },
    },
  },
  {
    id: "cosmo",
    name: "Cosmo",
    status: "producao",
    route: "/projetos/cosmo",
    isPublished: true,
    isListed: true,
    order: { backend: 2, dados: 3 },
    copy: {
      backend: {
        description:
          "Tutor inteligente com agentes em LangGraph servidos por FastAPI, com estado por aluno e cache de respostas por similaridade.",
        tags: ["LangGraph", "FastAPI", "PostgreSQL"],
      },
      dados: {
        description:
          "Agentes de IA que dão feedback em exercícios de Python, avaliados com dados históricos anonimizados de alunos.",
        tags: ["LLM", "agentes", "avaliação"],
      },
    },
  },
  {
    id: "documento-sinal",
    name: "Documento → sinal",
    status: "construcao",
    route: "/projetos/documento-sinal",
    isPublished: false,
    isListed: false,
    order: { backend: 4, dados: 2 },
    copy: {
      backend: {
        description:
          "Pipeline que recebe documentos da CVM, extrai com LLM e entrega saída validada por API.",
        tags: ["FastAPI", "fila", "validação"],
      },
      dados: {
        description:
          "Extração estruturada de fatos relevantes de FIIs com Gemini, medida campo a campo contra um gabarito.",
        tags: ["Gemini", "saída estruturada", "eval"],
      },
    },
  },
  {
    id: "gallifrey",
    name: "Gallifrey",
    status: "producao",
    route: "/projetos/gallifrey",
    isPublished: true,
    isListed: true,
    order: { backend: 3, dados: 5 },
    copy: {
      backend: {
        description:
          "Módulo de missões do Cosmo, levado de protótipo a produção dentro da Clean Architecture do back-end.",
        tags: ["TypeScript", "Prisma", "PostgreSQL"],
      },
      dados: {
        description:
          "Questões de Python marcadas por nível da taxonomia de Bloom, usado como dado interno de progresso.",
        tags: ["Bloom", "dados de aprendizagem"],
      },
    },
  },
  {
    id: "recomendacao",
    name: "Recomendação sequencial",
    status: "pesquisa",
    route: "/projetos/recomendacao",
    isPublished: true,
    isListed: true,
    order: { backend: 5, dados: 4 },
    copy: {
      backend: {
        description: "Modelo de recomendação exposto como endpoint de inferência.",
        tags: ["inferência", "API"],
      },
      dados: {
        description:
          "Iniciação científica com BERT4Rec: prever o próximo item a partir da sequência de interações.",
        tags: ["BERT4Rec", "recomendação"],
      },
    },
  },
] as const satisfies readonly Project[];

export const unpublishedHref = "#";

export const listedProjects = projects.filter((project) => project.isListed);

export function getProjectHref(project: Project): string {
  return project.isPublished ? project.route : unpublishedHref;
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
