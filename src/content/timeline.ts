export interface TimelineEvent {
  /** Position on the axis, as a fractional year (2025.5 = mid-2025). */
  at: number;
  when: string;
  title: string;
  body: string;
}

export const timelineRange = {
  start: 2020,
  end: 2028,
  /** Where autoplay stops: just after the last milestone. */
  autoplayEnd: 2027.95,
  step: 0.05,
  ticks: [2020, 2022, 2024, 2026, 2028],
} as const;

export const timelineContent = {
  rangeLabel: "Ano",
  listLabel: "Marcos da trajetória",
  describeValue: (year: number, current: TimelineEvent | undefined) =>
    current ? `${year}: ${current.title}` : String(year),
} as const;

export const timelineEvents = [
  {
    at: 2020,
    when: "2020 — 2022",
    title: "Técnico em Informática",
    body: "Ensino médio integrado ao técnico no IFMA.",
  },
  {
    at: 2024,
    when: "[Ano]",
    title: "Ciência da Computação",
    body: "Entrada no curso na UFMA.",
  },
  {
    at: 2025.2,
    when: "Mar — Ago 2025",
    title: "Monitora de Algoritmos I",
    body: "Ajudando turmas na disciplina que o Cosmo atende hoje.",
  },
  {
    at: 2025.5,
    when: "[Início]",
    title: "Laboratório TeleMídia",
    body: "Desenvolvimento do Cosmo e iniciação científica (PIBIC e PIBITI).",
  },
  {
    at: 2025.9,
    when: "[Período]",
    title: "Pesquisa em recomendação",
    body: "Análise e preparação de dados para um recomendador com BERT4Rec.",
  },
  {
    at: 2026.4,
    when: "2026",
    title: "Artigo no SBIE",
    body: "O Cosmo vira artigo completo, hoje em avaliação.",
  },
  {
    at: 2026.78,
    when: "Out 2026",
    title: "Gallifrey em produção",
    body: "O módulo de missões entra no ar para os alunos.",
  },
  {
    at: 2027.95,
    when: "Dez 2027",
    title: "Formatura prevista",
    body: "Bacharelado em Ciência da Computação, UFMA.",
  },
] as const satisfies readonly TimelineEvent[];
