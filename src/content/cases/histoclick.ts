import type { Architecture, CaseStudy } from "@/content/caseStudy";
import { histoclickDecisions } from "@/content/decisions";
import { projectPageContent } from "@/content/projectPage";

export type HistoclickNodeId = "app" | "auth" | "db" | "storage";

/** Same scale as the Cosmo diagram, so both read at the same size. */
const architecture: Architecture<HistoclickNodeId> = {
  width: 1240,
  height: 340,
  nodes: {
    app: { x: 140, y: 139, label: "App", sub: "React Native · Expo" },
    auth: { x: 930, y: 20, label: "Autenticação", sub: "Supabase Auth" },
    db: { x: 930, y: 139, label: "Banco", sub: "Postgres · RLS" },
    storage: { x: 930, y: 258, label: "Imagens", sub: "Supabase Storage" },
  },
  edges: [
    ["app", "auth"],
    ["app", "db"],
    ["app", "storage"],
    ["auth", "db"],
  ],
};

export const histoclickCase: CaseStudy<HistoclickNodeId> = {
  meta: {
    title: "Histoclick",
    description:
      "Estudo de caso do Histoclick, atlas interativo de patologias bucais para o ensino de odontologia, contado pelas decisões que moldaram o app.",
  },
  nav: [
    { label: projectPageContent.homeNavLabel, href: projectPageContent.homeHref },
    { label: "Onde está hoje", href: "#hoje" },
  ],
  hero: {
    kicker: "Estudo de caso — App mobile",
    titleLines: ["Histoclick"],
    titleSize: "displayPage",
    intro:
      "Atlas interativo de patologias bucais para o ensino de odontologia, com 35 patologias e lâminas microscópicas com zoom e hotspots, além de busca e filtros. Feito para Android e iOS.",
    facts: [
      { label: "Onde", value: "Projeto com cliente, equipe de 7 pessoas" },
      { label: "Papel", value: "Única desenvolvedora do app" },
      { label: "Status", isStatus: true },
    ],
  },
  decisions: {
    title: "Duas decisões",
    diagramName: "Arquitetura do Histoclick",
    items: histoclickDecisions,
    architecture,
  },
  today: {
    id: "hoje",
    title: "Onde está hoje",
    body: "O Atlas já roda em build de desenvolvimento, ainda fora das lojas. A versão 2 vai trazer atividades e gamificação.",
    tags: ["React Native", "Expo", "TypeScript", "Supabase"],
    links: [],
  },
};
