import type { Architecture, CaseStudy } from "@/content/caseStudy";
import { agentDecisions } from "@/content/decisions";
import { projectPageContent } from "@/content/projectPage";
import { getPublishedRoute } from "@/content/projects";

export type AgentNodeId = "api" | "sup" | "ag" | "cache" | "mem";

/** Same scale as the Cosmo diagram, so both read at the same size. */
const architecture: Architecture<AgentNodeId> = {
  width: 1240,
  height: 300,
  nodes: {
    api: { x: 150, y: 119, label: "API", sub: "FastAPI" },
    sup: { x: 535, y: 119, label: "Supervisor", sub: "LangGraph" },
    ag: { x: 920, y: 20, label: "Agentes", sub: "API do Claude" },
    mem: { x: 920, y: 119, label: "Memória", sub: "MemorySaver" },
    cache: { x: 920, y: 218, label: "Cache CBR", sub: "MD5 · Jaccard" },
  },
  edges: [
    ["api", "sup"],
    ["sup", "ag"],
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
      "Agentes de IA que dão feedback em exercícios de Python, desenvolvidos na iniciação científica e integrados ao Cosmo. Contados pelas escolhas que moldaram a arquitetura.",
    facts: [
      { label: "Onde", value: "TeleMídia · UFMA" },
      { label: "Status", isStatus: true },
      { label: "Pesquisa", value: "PIBIC · ago/2025 – ago/2026" },
      { label: "Integração", value: "Cosmo" },
    ],
  },
  decisions: {
    title: "Três decisões",
    diagramName: "Arquitetura dos agentes tutores",
    items: agentDecisions,
  },
  architecture,
  today: {
    id: "hoje",
    title: "Onde está hoje",
    body: "Em pesquisa na iniciação científica (PIBIC, ago/2025 – ago/2026), com os agentes integrados ao Cosmo.",
    tags: ["Python", "LangGraph", "FastAPI", "API do Claude", "MemorySaver"],
    links: [],
  },
};
