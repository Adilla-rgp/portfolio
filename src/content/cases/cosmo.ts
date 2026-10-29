import type { Architecture, CaseLink, CaseStudy } from "@/content/caseStudy";
import { cosmoDecisions } from "@/content/decisions";
import { projectPageContent } from "@/content/projectPage";
import { getPublishedRoute } from "@/content/projects";

export type CosmoNodeId = "aluno" | "front" | "back" | "pg" | "gal" | "liga" | "agentes";

export const cosmoProductUrl = "https://cosmo.telemidia-ma.com.br/";

/** Layout from Case.dc.html, redrawn for the current architecture. */
const architecture: Architecture<CosmoNodeId> = {
  width: 1240,
  height: 480,
  nodes: {
    aluno: { x: 40, y: 190, label: "Aluno", sub: "navegador" },
    front: { x: 290, y: 190, label: "Front", sub: "Next.js" },
    back: { x: 540, y: 190, label: "Back-end", sub: "Node · Clean Arch" },
    pg: { x: 1030, y: 190, label: "PostgreSQL", sub: "Prisma" },
    gal: { x: 790, y: 60, label: "Gallifrey", sub: "missões" },
    liga: { x: 790, y: 320, label: "Liga", sub: "ranking semanal" },
    agentes: {
      x: 540,
      y: 380,
      label: "Agentes tutores",
      sub: "pesquisa · PIBIC",
      href: getPublishedRoute("agentes"),
    },
  },
  edges: [
    ["aluno", "front"],
    ["front", "back"],
    ["back", "pg"],
    ["back", "gal"],
    ["back", "liga"],
    ["gal", "pg"],
    ["liga", "pg"],
    ["back", "agentes"],
  ],
};

const productLink: CaseLink = { label: "Ver o Cosmo ↗", href: cosmoProductUrl };

export const cosmoCase: CaseStudy<CosmoNodeId> = {
  meta: {
    title: "Cosmo",
    description:
      "Estudo de caso do Cosmo, plataforma de questões de programação usada por alunos da UFMA, contado pelas decisões que moldaram o sistema.",
  },
  nav: [
    { label: projectPageContent.homeNavLabel, href: projectPageContent.homeHref },
    { label: "Onde está hoje", href: "#hoje" },
  ],
  hero: {
    kicker: "Estudo de caso — /backend",
    titleLines: ["Cosmo"],
    intro:
      "Uma plataforma de questões de programação, no estilo do LeetCode, onde alunos da UFMA resolvem exercícios. Ajudei a construí-la do zero com a equipe do laboratório, desde quando era um monólito. Contada pelas escolhas que moldaram o sistema.",
    facts: [
      { label: "Onde", value: "TeleMídia · UFMA" },
      { label: "Status", isStatus: true },
      { label: "Papel", value: "arquitetura, código e banco de dados" },
    ],
  },
  decisions: {
    title: "Três decisões",
    diagramName: "Arquitetura do Cosmo",
    items: cosmoDecisions,
    architecture,
  },
  today: {
    id: "hoje",
    title: "Onde está hoje",
    body: "Em produção com alunos de programação da UFMA, com o Gallifrey e a Liga no ar.",
    tags: ["Next.js", "TypeScript", "Node", "Clean Architecture", "Prisma", "PostgreSQL"],
    links: [productLink],
  },
};
