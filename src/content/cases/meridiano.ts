import type { Architecture, CaseLink, CaseStudy } from "@/content/caseStudy";
import { meridianoDecisions } from "@/content/decisions";
import { projectPageContent } from "@/content/projectPage";

export type MeridianoNodeId = "front" | "api" | "parser" | "motor" | "pg" | "demo";

export const meridianoProductUrl = "https://meridiano2.vercel.app";

/** Same scale as the Cosmo diagram, so both read at the same size. */
const architecture: Architecture<MeridianoNodeId> = {
  width: 1240,
  height: 340,
  nodes: {
    front: { x: 40, y: 119, label: "Front", sub: "React · Vite" },
    api: { x: 330, y: 119, label: "API", sub: "FastAPI" },
    parser: { x: 660, y: 20, label: "Parser", sub: "regras · LLM opcional" },
    motor: { x: 660, y: 218, label: "Motor", sub: "Python puro" },
    pg: { x: 1030, y: 119, label: "PostgreSQL", sub: "SQLAlchemy" },
    demo: { x: 330, y: 260, label: "Demonstração", sub: "saídas do motor" },
  },
  edges: [
    ["front", "api"],
    ["api", "parser"],
    ["api", "motor"],
    ["api", "pg"],
    ["motor", "demo"],
    ["demo", "front"],
  ],
};

const links: readonly CaseLink[] = [
  { label: "Ver a demonstração ↗", href: meridianoProductUrl },
  { label: "Código do front ↗", href: "https://github.com/Adilla-rgp/meridiano" },
  { label: "Código do motor e da API ↗", href: "https://github.com/Adilla-rgp/meridiano-api" },
];

export const meridianoCase: CaseStudy<MeridianoNodeId> = {
  meta: {
    title: "Meridiano",
    description:
      "Meridiano: planejador de viagens em grupo que busca o consenso entre as restrições de cada pessoa e explica as concessões feitas, contado pelas decisões do motor.",
  },
  nav: [
    { label: projectPageContent.homeNavLabel, href: projectPageContent.homeHref },
    { label: "Onde está hoje", href: "#hoje" },
  ],
  hero: {
    kicker: "Estudo de caso — Viagens em grupo",
    titleLines: ["Meridiano"],
    titleSize: "displayPage",
    intro:
      "Um planejador de viagens em grupo: busca o consenso entre as restrições de cada pessoa e explica as concessões feitas. Começou em 2024 como um site de viagem para treinar desenvolvimento web e foi refeito em 2026 como projeto de portfólio. Contado pelas escolhas que moldaram o motor.",
    facts: [
      { label: "Onde", value: "Projeto pessoal" },
      { label: "Status", isStatus: true },
      { label: "Papel", value: "Produto, front e back-end" },
    ],
  },
  decisions: {
    title: "Três decisões",
    diagramName: "Arquitetura do Meridiano",
    items: meridianoDecisions,
    architecture,
  },
  today: {
    id: "hoje",
    title: "Onde está hoje",
    body: "Demonstração pública: roda no navegador com uma viagem de exemplo, e os planos, justificativas e conflitos que ela mostra foram calculados pelo motor real. O modo completo, com a API e o PostgreSQL, roda localmente.",
    tags: [
      "Python",
      "FastAPI",
      "SQLAlchemy",
      "Alembic",
      "PostgreSQL",
      "pytest",
      "TypeScript",
      "React",
      "Vite",
      "Tailwind CSS",
      "LLM",
    ],
    links,
  },
};
