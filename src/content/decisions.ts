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
  tradeoff: string;
  /** What changed after the decision. null hides the "Resultado" block. */
  result: string | null;
  /** Architecture nodes lit while this decision is shown. */
  nodes: readonly CosmoNodeId[];
}

/** The Cosmo decisions from docs/design-reference/Case.dc.html. */
export const decisions: readonly Decision[] = [
  {
    id: "langgraph",
    tag: "Arquitetura",
    short: "LangGraph",
    title: "Orquestrar os agentes com LangGraph",
    context:
      "O Cosmo começou como um sistema multiagente em Python, com a orquestração espalhada entre os próprios agentes.",
    choice:
      "Migrar para um StateGraph: estado tipado (CosmoState), um nó supervisor que decide o próximo agente e checkpoint por aluno.",
    alternative: null,
    tradeoff: "Fluxo explícito e estado inspecionável, em troca de depender de um framework ainda jovem.",
    result: null,
    nodes: ["api", "sup", "ag"],
  },
  {
    id: "cache-cbr",
    tag: "Desempenho",
    short: "Cache CBR",
    title: "Cache de respostas por similaridade",
    context:
      "Alunos diferentes erram o mesmo exercício de jeitos parecidos, e cada chamada ao LLM custa dinheiro e espera.",
    choice:
      "Cache baseado em casos: hash MD5 para pedidos idênticos e similaridade de Jaccard para os parecidos.",
    alternative: null,
    tradeoff: "Barato e determinístico, mas reconhece semelhança de palavras, não de significado.",
    result: null,
    nodes: ["sup", "cache"],
  },
  {
    id: "memoria",
    tag: "Estado",
    short: "Memória",
    title: "Memória por aluno e exercício",
    context: "O tutor precisa lembrar a conversa sem misturar exercícios nem alunos.",
    choice: "MemorySaver com uma thread por par aluno–exercício, exposto por um endpoint FastAPI.",
    alternative: null,
    tradeoff:
      "Contexto isolado e previsível; o que o aluno aprendeu em outro exercício fica de fora.",
    result: null,
    nodes: ["api", "sup", "mem"],
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
    nodes: ["aluno", "back", "gal"],
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
    result: null,
    nodes: ["back", "liga", "pg"],
  },
];
