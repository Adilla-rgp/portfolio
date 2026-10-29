import type { SiteNavItem } from "@/components/layout/SiteHeader";
import { projectPageContent } from "@/content/projectPage";

export interface Topic {
  id: string;
  label: string;
}

/** Python course topics in curriculum order; the toy model leans on it. */
export const topics = [
  { id: "variaveis", label: "Variáveis" },
  { id: "condicionais", label: "Condicionais" },
  { id: "lacos", label: "Laços" },
  { id: "funcoes", label: "Funções" },
  { id: "listas", label: "Listas" },
  { id: "strings", label: "Strings" },
  { id: "dicionarios", label: "Dicionários" },
  { id: "recursao", label: "Recursão" },
] as const satisfies readonly Topic[];

export type TopicId = (typeof topics)[number]["id"];

/** Extra pull between related topics, on top of curriculum order. */
export const thematicLinks: readonly (readonly [TopicId, TopicId])[] = [
  ["funcoes", "recursao"],
  ["listas", "dicionarios"],
  ["lacos", "listas"],
  ["strings", "listas"],
];

/** Sequence the training animation masks, as in Rec.dc.html. */
export const trainingSequence: readonly TopicId[] = [
  "variaveis",
  "condicionais",
  "lacos",
  "listas",
  "strings",
  "funcoes",
  "dicionarios",
  "recursao",
];

/** Research facts still to be filled in; null hides them on the page. */
interface RecommendationResearch {
  /** Name of the dataset the interactions came from. */
  dataset: string | null;
  /** What the exploratory analysis found. */
  findings: string | null;
  /** Filters and decisions made while preparing the sequences. */
  preparation: string | null;
  /** How the model and the path builder fit together. */
  approach: string | null;
  metrics: {
    hrAt10: string | null;
    ndcgAt10: string | null;
    baseline: string | null;
  };
}

export const recommendationResearch: RecommendationResearch = {
  dataset:
    "Dois datasets públicos de submissões de programação do Codeforces, com cerca de 1 milhão e 14 milhões de registros, e um dataset próprio do laboratório com cerca de 20 mil registros de alunos da UFMA.",
  findings: null,
  preparation: null,
  approach:
    "Combinei o BERT4Rec com metaheurísticas para montar trilhas de estudo personalizáveis: o modelo aprende as sequências, e as metaheurísticas montam a trilha.",
  metrics: { hrAt10: null, ndcgAt10: null, baseline: null },
};

const nav: readonly SiteNavItem[] = [
  { label: projectPageContent.homeNavLabel, href: projectPageContent.homeHref },
  { label: "Como aprende", href: "#como" },
];

export const recommendationCase = {
  meta: {
    title: "Recomendação sequencial",
    description:
      "Sistema de recomendação educacional com BERT4Rec: prever o próximo tópico de estudo a partir da sequência de um aluno. Pesquisa de iniciação científica (PIBITI).",
  },
  nav,
  hero: {
    kicker: "Pesquisa — /dados · Iniciação científica (PIBITI)",
    titleLines: ["O próximo", "tópico"],
    titleEnd: "?",
    intro:
      "Um sistema de recomendação educacional com BERT4Rec: olhar a ordem em que um aluno estudou os tópicos e prever o que ele deve estudar depois. Monte uma sequência e veja o raciocínio.",
  },
  demo: {
    ariaLabel: "Demonstração",
    pickStep: "1 · Escolha tópicos na ordem em que um aluno estudou",
    reset: "↺ Recomeçar",
    catalogLabel: "Tópicos",
    sequenceStep: "2 · A sequência · a altura da barra é quanto o modelo olhou para cada item",
    sequenceLabel: "Sequência do aluno",
    remove: (label: string) => `Remover ${label}`,
    position: (index: number) => `T${index + 1}`,
    attention: (percent: number) => `${percent}% atenção`,
    nextSlot: "Próximo",
    mask: "[MASK]",
    toPredict: "a prever",
    predictStep: "3 · O que o modelo prevê",
    predictionsLabel: "Tópicos mais prováveis",
    empty: "Adicione pelo menos um tópico para o modelo ter o que olhar.",
    describe: (label: string, percent: number) => `Mais provável a seguir: ${label}, ${percent}%.`,
    toyNote:
      "Modelo de brinquedo que roda no seu navegador, com afinidades entre tópicos escritas à mão. Não é o modelo treinado na pesquisa e não usa dados de alunos.",
    maxLength: 6,
  },
  how: {
    id: "como",
    kicker: "Como ele aprende",
    title: "Esconde e adivinha",
    directionLabel: "Direção do contexto",
    directions: [
      { value: "bi", label: "Bidirecional" },
      { value: "esquerda", label: "Só da esquerda" },
    ],
    text: {
      bi: "No treino, o BERT4Rec esconde itens aleatórios da sequência e aprende a adivinhá-los olhando para os dois lados. É a mesma ideia do BERT com palavras, aplicada à ordem de estudo.",
      esquerda:
        "Modelos da esquerda para a direita só enxergam o passado de cada posição. Compare quanto contexto some quando o lado direito é ignorado.",
    },
    sequenceLabel: "Sequência de treino com itens escondidos",
    legend: { masked: "item escondido", used: "contexto usado", ignored: "ignorado" },
  },
  role: {
    ariaLabel: "Meu papel",
    title: "O que eu fiz",
    exploration: {
      title: "Exploração",
      body: "Análise exploratória das interações dos alunos com os tópicos.",
      datasetLabel: "Dados",
    },
    preparation: {
      title: "Preparação",
      body: "Transformar o histórico em sequências ordenadas no tempo para o modelo.",
    },
    approach: { title: "Abordagem" },
    training: {
      title: "Treino",
      body: "Treino do BERT4Rec nas sequências preparadas.",
      metrics: (hr: string, ndcg: string, baseline: string | null) =>
        `HR@10 ${hr} · NDCG@10 ${ndcg}${baseline ? ` contra ${baseline}` : ""}`,
    },
  },
} as const;

export type ContextDirection = (typeof recommendationCase.how.directions)[number]["value"];
