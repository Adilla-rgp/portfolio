import { site } from "@/content/site";

export const homeContent = {
  hero: {
    id: "topo",
    ariaLabel: "Abertura",
    kicker: {
      backend: "/backend — São Luís, BR",
      dados: "/dados — São Luís, BR",
    },
    titleLines: ["Do ruído", "ao sistema"],
    intro: {
      backend:
        "Construo os sistemas por trás de produtos com IA: APIs, filas, bancos e agentes em produção. Passe o mouse no sinal.",
      dados:
        "Levo modelos e dados do notebook para produção, sempre com uma forma de medir se funcionam. Passe o mouse no sinal.",
    },
    cta: { label: "Ver o trabalho ↓", href: "#trabalho" },
    particlesPlaceholder: "[peça interativa: partículas do ruído ao sinal]",
  },
  status: {
    ariaLabel: "Status ao vivo",
    apiOnline: "API online",
    clockLabel: "São Luís",
    clockFallback: "--:--:--",
    items: [
      "P95 [— ms]",
      "Deploy [sha]",
      "Cosmo · em produção",
      "Gallifrey · em produção",
      "SBIE 2026 · em avaliação",
    ],
    lensPrefix: "Lente /",
  },
  trace: {
    id: "trace",
    kicker: "01 — O sistema",
    title: "Esta página, por dentro",
    body: "O site roda numa API minha. Dispare a requisição e veja cada etapa acontecer. Depois esquente o cache e compare.",
    controlsPlaceholder: "[peça interativa: disparar GET /home · cache frio/quente]",
    panelPlaceholder: "[peça interativa: trace de 5 etapas]",
  },
  threshold: {
    ariaLabel: "Gráfico explorável",
    kicker: "02 — Uma decisão do Cosmo",
    title: "Arraste o limiar",
    body: "O tutor reaproveita respostas quando dois pedidos são parecidos o bastante. Limiar baixo economiza chamadas ao LLM, mas devolve feedback errado. Onde você cortaria?",
    stats: [
      { id: "hits", label: "Acertos de cache", value: "[—%]", accent: true },
      { id: "wrong", label: "Reuso errado", value: "[—%]", accent: false },
    ],
    verdict: "[frase que muda conforme a zona do limiar]",
    chartPlaceholder: "[peça interativa: gráfico do limiar de Jaccard]",
    controlsPlaceholder: "[peça interativa: controle do limiar e legenda]",
  },
  work: {
    id: "trabalho",
    title: "Trabalho",
    orderPrefix: "Ordem da lente /",
  },
  footer: {
    id: "contato",
    cta: "Vamos conversar",
    ctaArrow: "→",
    place: "São Luís, BR · UFMA · Laboratório Telemídia",
    navLabel: "Contato",
    links: [
      { label: "Cal.com ↗", href: site.links.cal },
      { label: "GitHub ↗", href: site.links.github },
      { label: "LinkedIn ↗", href: site.links.linkedin },
    ],
  },
} as const;
