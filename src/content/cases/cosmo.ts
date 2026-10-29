import type { SiteNavItem } from "@/components/layout/SiteHeader";
import { projectPageContent } from "@/content/projectPage";

export type CosmoNodeId = "aluno" | "front" | "back" | "pg" | "gal" | "liga" | "agentes";

export interface ArchitectureNode {
  label: string;
  sub: string;
  /** Top-left corner in diagram units. */
  x: number;
  y: number;
}

/** Layout from Case.dc.html, redrawn for the current architecture, in viewBox units. */
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
    aluno: { x: 40, y: 190, label: "Aluno", sub: "navegador" },
    front: { x: 290, y: 190, label: "Front", sub: "Next.js" },
    back: { x: 540, y: 190, label: "Back-end", sub: "Node · Clean Arch" },
    pg: { x: 1030, y: 190, label: "PostgreSQL", sub: "Prisma" },
    gal: { x: 790, y: 60, label: "Gallifrey", sub: "missões" },
    liga: { x: 790, y: 320, label: "Liga", sub: "ranking semanal" },
    agentes: { x: 540, y: 380, label: "Agentes tutores", sub: "pesquisa · PIBIC" },
  } satisfies Record<CosmoNodeId, ArchitectureNode>,
  edges: [
    ["aluno", "front"],
    ["front", "back"],
    ["back", "pg"],
    ["back", "gal"],
    ["back", "liga"],
    ["gal", "pg"],
    ["liga", "pg"],
    ["back", "agentes"],
  ] satisfies readonly (readonly [CosmoNodeId, CosmoNodeId])[],
} as const;

export interface CaseLink {
  label: string;
  /** Hidden until there is a real destination. */
  href: string | null;
}

export const cosmoProductUrl = "https://cosmo.telemidia-ma.com.br/";

const productLink: CaseLink = { label: "Ver o Cosmo ↗", href: cosmoProductUrl };

const nav: readonly SiteNavItem[] = [
  { label: projectPageContent.homeNavLabel, href: projectPageContent.homeHref },
  { label: "Onde está hoje", href: "#hoje" },
];

export const cosmoCase = {
  meta: {
    title: "Cosmo",
    description:
      "Estudo de caso do Cosmo, plataforma de questões de programação usada por alunos da UFMA, contado pelas decisões que moldaram o sistema.",
  },
  nav,
  hero: {
    kicker: "Estudo de caso — /backend",
    titleLines: ["Cosmo"],
    intro:
      "Uma plataforma de questões de programação, no estilo do LeetCode, onde alunos da UFMA resolvem exercícios. Ajudei a construí-la do zero com a equipe do laboratório, desde quando era um monólito. Contada pelas escolhas que moldaram o sistema.",
    facts: {
      where: { label: "Onde", value: "TeleMídia · UFMA" },
      status: { label: "Status" },
      role: { label: "Papel", value: "arquitetura, código e banco de dados" },
    },
  },
  decisions: {
    ariaLabel: "Decisões",
    title: "Três decisões",
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
    body: "Em produção com alunos de programação da UFMA, com o Gallifrey e a Liga no ar.",
    tags: ["Next.js", "TypeScript", "Node", "Clean Architecture", "Prisma", "PostgreSQL"],
    links: [productLink],
  },
} as const;
