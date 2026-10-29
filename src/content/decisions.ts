import type { CosmoNodeId } from "@/content/cases/cosmo";

export interface Decision {
  id: string;
  tag: string;
  /** Tab label. */
  short: string;
  title: string;
  context: string;
  choice: string;
  /** The path not taken. null hides the "Não escolhi" card and its toggle. */
  alternative: string | null;
  /** null hides the "Trade-off" block. */
  tradeoff: string | null;
  /** What changed after the decision. null hides the "Resultado" block. */
  result: string | null;
  /** Architecture nodes lit while this decision is shown. */
  nodes: readonly CosmoNodeId[];
}

/** The Cosmo decisions, in the order of the tour. */
export const decisions: readonly Decision[] = [
  {
    id: "microsservicos",
    tag: "Arquitetura",
    short: "Microsserviços",
    title: "Do monólito aos microsserviços",
    context: "O Cosmo começou como um monólito.",
    choice:
      "Separar o sistema em microsserviços, com back-end em Node e TypeScript seguindo Clean Architecture, Prisma e PostgreSQL. O Gallifrey entrou como um microsserviço.",
    alternative: null,
    tradeoff: null,
    result: null,
    nodes: ["front", "back", "pg", "gal"],
  },
  {
    id: "gallifrey",
    tag: "Produto",
    short: "Gallifrey",
    title: "Gallifrey como prática voluntária",
    context:
      "O módulo de missões de Python podia virar um checkpoint obrigatório entre um tópico e outro.",
    choice:
      "Na v1, uma área própria de prática voluntária, seguindo a orientação do orientador. O nível de Bloom de cada questão fica interno.",
    alternative: "Bloquear o próximo tópico até o aluno concluir as missões do anterior.",
    tradeoff: "Menos atrito e lançamento mais rápido, com menos sinal sobre o domínio de cada tópico.",
    result:
      "Em produção desde outubro de 2026. O checkpoint segue no plano para uma próxima versão.",
    nodes: ["aluno", "front", "back", "gal"],
  },
  {
    id: "liga",
    tag: "Produto",
    short: "Liga",
    title: "Liga por semestre",
    context: "O ranking antigo somava os pontos de toda a plataforma, desde sempre.",
    choice:
      "Ranking semanal da Liga, que recomeça a cada semestre, com o histórico completo acessível.",
    alternative: "Manter um ranking geral acumulado.",
    tradeoff:
      "Quem chega agora tem chance real de subir; o acumulado vira histórico em vez de placar.",
    result: "Em produção.",
    nodes: ["back", "liga", "pg"],
  },
];
