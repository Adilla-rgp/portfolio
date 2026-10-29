import type { AgentNodeId } from "@/content/cases/agentes";
import type { CosmoNodeId } from "@/content/cases/cosmo";
import type { Decision } from "@/content/caseStudy";

/** The Cosmo decisions, in the order of the tour. */
export const cosmoDecisions: readonly Decision<CosmoNodeId>[] = [
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

/** The tutoring agents decisions, in the order of the tour. */
export const agentDecisions: readonly Decision<AgentNodeId>[] = [
  {
    id: "langgraph",
    tag: "Arquitetura",
    short: "LangGraph",
    title: "Orquestrar os agentes com LangGraph",
    context:
      "Os agentes tutores começaram como um sistema multiagente em Python, com a orquestração espalhada entre os próprios agentes.",
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
];
