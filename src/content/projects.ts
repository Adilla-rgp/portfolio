import type { ByLens } from "@/content/lens";

export type ProjectStatus = "producao" | "construcao" | "pesquisa";

export const projectStatusLabel: Record<ProjectStatus, string> = {
  producao: "Em produção",
  construcao: "Em construção",
  pesquisa: "Pesquisa",
};

interface ProjectLensCopy {
  description: string;
  tags: readonly string[];
}

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  /** Final route of the case page. */
  route: string;
  /** False until the case page exists; links then point to `#`. */
  isPublished: boolean;
  /** Position in the work list for each lens (1 = first). */
  order: ByLens<number>;
  copy: ByLens<ProjectLensCopy>;
}

export const projects = [
  {
    id: "cosmo",
    name: "Cosmo",
    status: "producao",
    route: "/projetos/cosmo",
    isPublished: false,
    order: { backend: 1, dados: 2 },
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
    order: { backend: 3, dados: 1 },
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
    isPublished: false,
    order: { backend: 2, dados: 4 },
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
    isPublished: false,
    order: { backend: 4, dados: 3 },
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

export function getProjectHref(project: Project): string {
  return project.isPublished ? project.route : unpublishedHref;
}
