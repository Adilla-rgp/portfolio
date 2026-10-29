export interface TimelineEvent {
  /** Position on the axis, as a fractional year (2025.5 = mid-2025). */
  at: number;
  when: string;
  title: string;
  body: string;
}

const MONTHS_PER_YEAR = 12;

/** Axis position of the start of a month (March 2024 = 2024 + 2/12). */
function monthAt(year: number, month: number): number {
  return year + (month - 1) / MONTHS_PER_YEAR;
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
  describeValue: (year: number, current: readonly TimelineEvent[]) =>
    current.length ? `${year}: ${current.map((event) => event.title).join(", ")}` : String(year),
} as const;

export const timelineEvents = [
  {
    at: 2020,
    when: "2020 — 2022",
    title: "Técnico em Informática",
    body: "Ensino médio integrado ao técnico no IFMA.",
  },
  {
    at: monthAt(2024, 3),
    when: "Mar 2024",
    title: "Ciência da Computação",
    body: "Entrada no curso na UFMA.",
  },
  {
    at: monthAt(2024, 8),
    when: "Desde ago 2024",
    title: "Laboratório TeleMídia",
    body: "Desenvolvimento do Cosmo e iniciação científica (PIBIC e PIBITI).",
  },
  {
    at: monthAt(2024, 8),
    when: "Ago 2024 — Ago 2025",
    title: "Pesquisa em recomendação (PIBITI)",
    body: "Sistema de recomendação educacional com BERT4Rec, da análise e preparação dos dados ao treino do modelo.",
  },
  {
    at: monthAt(2025, 3),
    when: "Mar — Ago 2025",
    title: "Monitora de Algoritmos I",
    body: "Ajudando turmas na disciplina que o Cosmo atende hoje.",
  },
  {
    at: monthAt(2025, 8),
    when: "Ago 2025 — Ago 2026",
    title: "Agentes do Cosmo (PIBIC)",
    body: "Construção dos agentes tutores inteligentes do Cosmo.",
  },
  {
    at: monthAt(2026, 10),
    when: "Out 2026",
    title: "Gallifrey em produção",
    body: "O módulo de missões entra no ar para os alunos.",
  },
  {
    at: monthAt(2027, 12),
    when: "Dez 2027",
    title: "Formatura prevista",
    body: "Bacharelado em Ciência da Computação, UFMA.",
  },
] as const satisfies readonly TimelineEvent[];
