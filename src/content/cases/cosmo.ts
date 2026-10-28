import type { SiteNavItem } from "@/components/layout/SiteHeader";
import { projectPageContent } from "@/content/projectPage";

export type CosmoNodeId =
  | "aluno"
  | "back"
  | "gal"
  | "liga"
  | "pg"
  | "api"
  | "sup"
  | "ag"
  | "cache"
  | "mem";

export interface ArchitectureNode {
  label: string;
  sub: string;
  /** Top-left corner in diagram units. */
  x: number;
  y: number;
}

/** Diagram from Case.dc.html, in viewBox units. */
export const cosmoArchitecture = {
  width: 1240,
  height: 480,
  node: {
    width: 170,
    height: 62,
    radius: 10,
    paddingX: 14,
    /** Text sizes and baselines, in diagram units. */
    labelSize: 16,
    labelBaseline: 27,
    subSize: 11,
    subBaseline: 46,
  },
  stroke: { idle: 1.5, lit: 2.5 },
  nodes: {
    aluno: { x: 40, y: 208, label: "Aluno", sub: "front · Next.js" },
    back: { x: 320, y: 110, label: "Back-end", sub: "Node · Clean Arch" },
    gal: { x: 600, y: 50, label: "Gallifrey", sub: "missões" },
    liga: { x: 600, y: 170, label: "Liga", sub: "ranking semanal" },
    pg: { x: 880, y: 110, label: "PostgreSQL", sub: "Prisma" },
    api: { x: 320, y: 320, label: "API de IA", sub: "FastAPI" },
    sup: { x: 600, y: 320, label: "Supervisor", sub: "LangGraph" },
    ag: { x: 880, y: 250, label: "Agentes", sub: "API do Claude" },
    cache: { x: 880, y: 390, label: "Cache CBR", sub: "MD5 · Jaccard" },
    mem: { x: 1040, y: 320, label: "Memória", sub: "MemorySaver" },
  } satisfies Record<CosmoNodeId, ArchitectureNode>,
  edges: [
    ["aluno", "back"],
    ["aluno", "api"],
    ["back", "gal"],
    ["back", "liga"],
    ["back", "pg"],
    ["liga", "pg"],
    ["api", "sup"],
    ["sup", "ag"],
    ["sup", "cache"],
    ["sup", "mem"],
  ] satisfies readonly (readonly [CosmoNodeId, CosmoNodeId])[],
} as const;

export interface CaseLink {
  label: string;
  /** Hidden until there is a real destination. */
  href: string | null;
}

const productLink: CaseLink = { label: "Ver o Cosmo ↗", href: null };
const articleLink: CaseLink = { label: "Ler o artigo ↗", href: null };

const nav: readonly SiteNavItem[] = [
  { label: projectPageContent.homeNavLabel, href: projectPageContent.homeHref },
  { label: "Onde está hoje", href: "#hoje" },
];

export const cosmoCase = {
  meta: {
    title: "Cosmo",
    description:
      "Estudo de caso do Cosmo, tutor inteligente com IA usado por alunos de Algoritmos na UFMA, contado pelas decisões que moldaram o sistema.",
  },
  nav,
  hero: {
    kicker: "Estudo de caso — /backend",
    titleLines: ["Cosmo"],
    intro:
      "Um tutor inteligente com IA, usado por alunos de Algoritmos na UFMA. Contado pelas escolhas que moldaram o sistema, e pelo caminho que ficou de fora em cada uma.",
    facts: {
      where: { label: "Onde", value: "TeleMídia · UFMA" },
      status: { label: "Status" },
      role: { label: "Papel", value: "desenvolvimento e pesquisa" },
      research: { label: "Pesquisa", value: "SBIE 2026, em avaliação" },
    },
  },
  decisions: {
    ariaLabel: "Decisões",
    title: "Cinco decisões",
    tabsLabel: "Escolha uma decisão",
    tour: { play: "▶ Tour automático", pause: "❚❚ Pausar tour" },
    diagramCaption: (num: string) => `Arquitetura · partes envolvidas na decisão ${num}`,
    describeDiagram: (num: string, parts: readonly string[]) =>
      `Arquitetura do Cosmo com as partes da decisão ${num} destacadas: ${parts.join(", ")}.`,
    decisionPrefix: "Decisão",
    chosen: "Escolhi",
    notChosen: "Não escolhi",
    flip: { show: "Ver o caminho não escolhido →", hide: "← Voltar à escolha" },
    tradeoff: "Trade-off",
    result: "Resultado",
  },
  today: {
    id: "hoje",
    title: "Onde está hoje",
    body: "Em produção com alunos de Algoritmos I. Os próximos passos são os agentes tutores e a avaliação com dados históricos anonimizados de alunos.",
    tags: ["LangGraph", "FastAPI", "API do Claude", "Node · TypeScript", "Prisma", "PostgreSQL", "Next.js"],
    links: [productLink, articleLink],
  },
} as const;
