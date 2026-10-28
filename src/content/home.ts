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
    replay: "↺ Voltar ao ruído",
  },
  status: {
    ariaLabel: "Status ao vivo",
    clockLabel: "São Luís",
    clockFallback: "--:--:--",
    deployFallback: "local",
    items: (deployId: string) => [
      "P95 [— ms]",
      `Deploy ${deployId}`,
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
    body: "Uma requisição a esta página, etapa por etapa. Dispare e veja cada etapa acontecer. Depois esquente o cache e compare.",
  },
  threshold: {
    ariaLabel: "Gráfico explorável",
    kicker: "02 — Uma decisão do Cosmo",
    title: "Arraste o limiar",
    body: "O tutor reaproveita respostas quando dois pedidos são parecidos o bastante. Limiar baixo economiza chamadas ao LLM, mas devolve feedback errado. Onde você cortaria?",
  },
  work: {
    id: "trabalho",
    title: "Trabalho",
    orderPrefix: "Ordem da lente /",
  },
} as const;
