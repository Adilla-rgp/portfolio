import { projectPageContent } from "@/content/projectPage";

export type MissionView = "aluno" | "sistema";

export interface MissionQuestion {
  prompt: string;
  /** Bloom level, internal to the system: never shown to the student. */
  bloom: string;
  code: string;
  options: readonly string[];
  correct: number;
  explanation: string;
}

/** Example mission from Gallifrey.dc.html: one planet, three questions. */
export const missionQuestions: readonly MissionQuestion[] = [
  {
    prompt: "O que este código imprime?",
    bloom: "lembrar",
    code: "nums = [4, 8, 15]\nprint(nums[-1])",
    options: ["4", "15", "-1", "IndexError"],
    correct: 1,
    explanation: "Índice -1 acessa o último elemento da lista.",
  },
  {
    prompt: "E este? Repare na segunda linha.",
    bloom: "entender",
    code: "x = [1, 2, 3]\ny = x\ny.append(4)\nprint(len(x))",
    options: ["3", "4", "None", "Erro"],
    correct: 1,
    explanation: "y = x não copia a lista: as duas variáveis apontam para o mesmo objeto.",
  },
  {
    prompt: "Qual é a saída?",
    bloom: "aplicar",
    code: "nums = [3, 1, 2]\nnums.sort()\nprint(nums[0] + nums[-1])",
    options: ["5", "4", "3", "[1, 3]"],
    correct: 1,
    explanation: "Depois do sort a lista é [1, 2, 3]; 1 + 3 = 4.",
  },
];

export const gallifreyCase = {
  meta: {
    title: "Gallifrey",
    description:
      "Gallifrey, o módulo de missões de Python do Cosmo para Algoritmos I: jogue uma missão e veja o que o back-end registra.",
  },
  homeNav: { label: projectPageContent.homeNavLabel, href: projectPageContent.homeHref },
  cosmoNavLabel: "Cosmo",
  hero: {
    kicker: "Módulo do Cosmo —",
    titleLines: ["Gallifrey"],
    intro:
      "Missões de questões de Python para Algoritmos I. Jogue uma abaixo, depois vire a chave e veja o que o sistema registra enquanto o aluno joga.",
  },
  mission: {
    ariaLabel: "Missão jogável",
    topic: "listas",
    planet: "Planeta · Listas",
    progress: (current: number, total: number) => `Questão ${current} de ${total}`,
    done: "Concluída",
    viewLabel: "Ponto de vista",
    views: [
      { value: "aluno", label: "Visão do aluno" },
      { value: "sistema", label: "Visão do sistema" },
    ],
    questionLabel: (current: number, total: number) => `Questão ${current} / ${total}`,
    bloomBadge: (level: string) => `Bloom · ${level} · invisível pro aluno`,
    optionLetters: ["A", "B", "C", "D"],
    feedback: { correct: "Isso!", wrong: "Quase." },
    next: "Próxima →",
    finish: "Ver resultado →",
    finished: "Missão concluída",
    scoreLabel: (score: number, total: number) => `${score} de ${total} acertos`,
    finalText: {
      perfect: "Planeta dominado. Vire para a visão do sistema e veja o que ficou registrado.",
      partial:
        "Cada tentativa fica registrada com o nível de Bloom da questão. Vire para a visão do sistema.",
    },
    restart: "↺ Jogar de novo",
    system: {
      title: "O que o back-end registra",
      note: "Campos ilustrativos: o schema real do Gallifrey pode ter outros nomes.",
    },
    product: {
      title: "Decisões de produto",
      items: [
        "Cada missão tem um único planeta. Sem misturar tópicos.",
        "O nível de Bloom guia o sistema, mas não aparece para o aluno.",
        "Na v1, prática voluntária. O checkpoint obrigatório fica para depois.",
      ],
      why: "Por quê? Ler no diário →",
    },
  },
  ship: {
    titleLines: ["Do protótipo", "à produção"],
    listLabel: "Etapas",
    steps: [
      {
        title: "Protótipo",
        body: "Front em React e Vite num repositório separado, com back-end simulado no navegador.",
      },
      { title: "Portar", body: "Levar o front para o padrão do Cosmo: Next.js e TypeScript." },
      {
        title: "Back-end",
        body: "Criar o serviço dentro da Clean Architecture do Cosmo, com Prisma e PostgreSQL.",
      },
      { title: "Stage", body: "Testes do orientador e da equipe da UFMA antes de liberar." },
      { title: "Produção", body: "No ar para os alunos em outubro de 2026." },
    ],
    tags: ["Next.js", "TypeScript", "Clean Architecture", "Prisma", "PostgreSQL"],
  },
} as const;
