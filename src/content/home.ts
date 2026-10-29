export const homeContent = {
  hero: {
    id: "topo",
    ariaLabel: "Abertura",
    kicker: "Back-end · IA · Dados — São Luís, BR",
    titleLines: ["Do ruído", "ao sistema"],
    intro:
      "Construo sistemas de back-end e de IA que chegam à produção: APIs, bancos de dados e agentes com LLMs, sempre com uma forma de medir se funcionam. Passe o mouse no sinal.",
    cta: { label: "Ver o trabalho ↓", href: "#trabalho" },
    replay: "↺ Voltar ao ruído",
  },
  status: {
    ariaLabel: "Status ao vivo",
    clockLabel: "São Luís",
    clockFallback: "--:--:--",
    deployFallback: "local",
    items: (deployId: string) => [
      `Deploy ${deployId}`,
      "Cosmo · em produção",
      "Gallifrey · em produção",
      "Liga · em produção",
    ],
  },
  trace: {
    id: "trace",
    kicker: "01 — O sistema",
    title: "Esta página, por dentro",
    body: "Uma requisição real ao conteúdo desta página, medida etapa por etapa no seu navegador. Dispare e veja cada etapa acontecer. Depois esquente o cache e compare.",
  },
  threshold: {
    ariaLabel: "Calculadora do cache",
    kicker: "02 — Uma decisão dos agentes tutores",
    title: "Arraste o limiar",
    body: "O tutor reaproveita a resposta quando um erro já apareceu: MD5 para a mesma mensagem, Jaccard sobre as palavras para as parecidas. Teste com as suas mensagens e arraste o limiar.",
  },
  work: {
    id: "trabalho",
    title: "Trabalho",
  },
} as const;
