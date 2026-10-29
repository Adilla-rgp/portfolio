import type { Architecture, CaseStudy } from "@/content/caseStudy";
import { agentDecisions } from "@/content/decisions";
import { projectPageContent } from "@/content/projectPage";
import { getPublishedRoute } from "@/content/projects";

export type AgentNodeId =
  | "api"
  | "sup"
  | "sintaxe"
  | "logica"
  | "contexto"
  | "qwen"
  | "cache"
  | "mem";

/** Same scale as the Cosmo diagram, so both read at the same size. */
const architecture: Architecture<AgentNodeId> = {
  width: 1240,
  height: 340,
  nodes: {
    api: { x: 40, y: 119, label: "API", sub: "FastAPI" },
    sup: { x: 330, y: 119, label: "Supervisor", sub: "LangGraph" },
    sintaxe: { x: 690, y: 20, label: "Sintaxe", sub: "agente" },
    logica: { x: 690, y: 119, label: "Lógica", sub: "agente" },
    contexto: { x: 690, y: 218, label: "Contexto", sub: "agente" },
    qwen: { x: 1030, y: 119, label: "Qwen", sub: "open source" },
    mem: { x: 190, y: 260, label: "Memória", sub: "MemorySaver" },
    cache: { x: 470, y: 260, label: "Cache CBR", sub: "MD5 · Jaccard" },
  },
  edges: [
    ["api", "sup"],
    ["sup", "sintaxe"],
    ["sup", "logica"],
    ["sup", "contexto"],
    ["sintaxe", "qwen"],
    ["logica", "qwen"],
    ["contexto", "qwen"],
    ["sup", "mem"],
    ["sup", "cache"],
  ],
};

const cosmoRoute = getPublishedRoute("cosmo");

export const agentsCase: CaseStudy<AgentNodeId> = {
  meta: {
    title: "Agentes tutores",
    description:
      "Agentes tutores com IA que dão feedback em exercícios de Python no Cosmo. Iniciação científica (PIBIC) contada pelas decisões de arquitetura.",
  },
  nav: [
    { label: projectPageContent.homeNavLabel, href: projectPageContent.homeHref },
    ...(cosmoRoute ? [{ label: "Cosmo", href: cosmoRoute }] : []),
    { label: "Onde está hoje", href: "#hoje" },
  ],
  hero: {
    kicker: "Estudo de caso — Iniciação científica (PIBIC)",
    titleLines: ["Agentes", "tutores"],
    titleSize: "displayPage",
    intro:
      "Agentes de IA que dão feedback em exercícios de Python, desenvolvidos na iniciação científica e integrados ao Cosmo. Usam o Qwen, um modelo open source, rodando no servidor do laboratório. Contados pelas escolhas que moldaram a arquitetura.",
    facts: [
      { label: "Onde", value: "TeleMídia · UFMA" },
      { label: "Status", isStatus: true },
      { label: "Pesquisa", value: "PIBIC · ago/2025 – ago/2026" },
      { label: "Integração", value: "Cosmo" },
    ],
  },
  decisions: {
    title: "Quatro decisões",
    diagramName: "Arquitetura dos agentes tutores",
    items: agentDecisions,
    architecture,
  },
  today: {
    id: "hoje",
    title: "Onde está hoje",
    body: "Em pesquisa na iniciação científica (PIBIC, ago/2025 – ago/2026), com os agentes integrados ao Cosmo.",
    tags: ["Python", "LangGraph", "FastAPI", "Qwen", "MemorySaver"],
    links: [],
  },
};
