import type { AgentNodeId } from "@/content/cases/agentes";
import type { CosmoNodeId } from "@/content/cases/cosmo";
import type { MeridianoNodeId } from "@/content/cases/meridiano";
import type { Decision } from "@/content/caseStudy";

/** The Cosmo decisions, in the order of the tour. */
export const cosmoDecisions: readonly Decision<CosmoNodeId>[] = [
  {
    id: "microsservicos",
    tag: "Arquitetura",
    short: "Microsserviços",
    title: "Do monólito aos microsserviços",
    context:
      "O Cosmo começou como um monólito. Acrescentar funcionalidades e manter o sistema atualizado ficava cada vez mais difícil, porque qualquer mudança mexia no sistema inteiro.",
    choice:
      "Separar o sistema em microsserviços, com back-end em Node e TypeScript seguindo Clean Architecture, Prisma e PostgreSQL. O Gallifrey entrou como um microsserviço.",
    alternative: "Continuar crescendo dentro do monólito.",
    tradeoff:
      "Mais peças para operar, como deploys e comunicação entre serviços, em troca de partes que evoluem e são mantidas separadamente.",
    result:
      "Novas áreas passaram a entrar como serviços próprios, sem mexer no resto. O Gallifrey foi o primeiro.",
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
    id: "modelo",
    tag: "Infraestrutura",
    short: "Qwen",
    title: "Modelo open source no servidor do laboratório",
    context:
      "Os agentes precisavam de um LLM, mas a pesquisa tem orçamento pequeno, e a ferramenta precisa continuar funcionando depois que eu sair da universidade.",
    choice:
      "Usar uma versão de porte médio do Qwen, um modelo open source, rodando no servidor do próprio laboratório.",
    alternative: "Usar a API de um modelo comercial pago.",
    tradeoff:
      "Sem custo por chamada e sem depender de um fornecedor externo, em troca de um modelo menor que os comerciais e de operar a infraestrutura dentro do laboratório.",
    result: "O porte médio equilibrou velocidade e qualidade das respostas no hardware do laboratório.",
    nodes: ["sintaxe", "logica", "contexto", "qwen"],
  },
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
    nodes: ["api", "sup", "sintaxe", "logica", "contexto"],
  },
  {
    id: "cache-cbr",
    tag: "Desempenho",
    short: "Cache CBR",
    title: "Cache de respostas por similaridade",
    context:
      "Alunos diferentes erram o mesmo exercício de jeitos parecidos, e cada chamada ao modelo ocupa o servidor do laboratório e faz o aluno esperar.",
    choice:
      "Cache baseado em casos: hash MD5 para pedidos idênticos e similaridade de Jaccard para os parecidos.",
    alternative: null,
    tradeoff:
      "Leve e determinístico, mas o Jaccard ignora a ordem dos tokens: 'Expected False got True' e 'Expected True got False' empatam em 1,0. Uma triagem por campos Expected/Got passou a barrar esses falsos positivos.",
    result:
      "Com limiar 0,85, o cache recuperou 96,85% dos erros da base completa (12.583 de 12.992 submissões com erro), e a taxa cresce conforme o histórico aumenta.",
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

/** The Meridiano decisions, in the order of the tour. */
export const meridianoDecisions: readonly Decision<MeridianoNodeId>[] = [
  {
    id: "parser",
    tag: "IA",
    short: "Parser",
    title: "Texto livre por regras, LLM opcional",
    context:
      "Cada pessoa escreve do jeito dela (\"no máximo R$ 1.100, não curto frio\"), mas o motor precisa de limites e preferências estruturados.",
    choice:
      "Interpretar o texto atrás de uma interface, com regras simples como padrão e sem chave de LLM. Um parser por LLM é opcional, só preenche um formato fixo e, se falhar, cai nas regras. Nos dois casos, a pessoa confirma o rascunho antes de salvar, e o motor nunca recebe texto livre.",
    alternative: "Usar um LLM como intérprete padrão.",
    tradeoff:
      "Sem custo por chamada, sem enviar o texto a um serviço externo e com o mesmo resultado a cada execução, em troca de uma cobertura limitada: apelidos de destino, valores em dinheiro, negações e datas ainda escapam das regras com frequência.",
    result:
      "No conjunto de teste, nunca usado em ajuste, as regras acertam 10 de 20 casos por inteiro e entre 80% e 100% de cada campo.",
    nodes: ["front", "api", "parser"],
  },
  {
    id: "consenso",
    tag: "Motor",
    short: "Consenso",
    title: "Um score que protege quem sairia pior",
    context:
      "Numa votação, a maioria escolhe e alguém fica para trás sem explicação.",
    choice:
      "Limites eliminam planos antes de qualquer cálculo. Os que sobram são pontuados por (1 − α) · média + α · mínimo da satisfação de cada pessoa, com α escolhido por quem organiza (padrão 0,5). Cada pessoa vê a própria satisfação ao lado da melhor que teria em algum plano viável, o que mostra quem cedeu e quanto.",
    alternative: "Escolher o plano pela média do grupo, como numa votação.",
    tradeoff:
      "Um plano um pouco pior para a média pode vencer quando ninguém fica muito para trás; o α deixa quem organiza calibrar essa troca.",
    result:
      "O motor é determinístico: a mesma viagem, em qualquer ordem, dá o mesmo resultado, e nenhum plano devolvido fere um limite. As duas garantias têm teste.",
    nodes: ["api", "motor"],
  },
  {
    id: "privacidade",
    tag: "Privacidade",
    short: "Orçamento",
    title: "Orçamento confidencial, testado na API inteira",
    context:
      "O orçamento de cada pessoa entra no cálculo, mas mostrar o valor ao grupo, ou só dizer de quem é o limite, expõe a pessoa.",
    choice:
      "No motor, um limite de orçamento aparece para o grupo sem dono, as justificativas não falam de orçamento e o mapa de tensões nunca o usa. Na API, um teste percorre todas as rotas como quem organiza e como cada convidado, em quatro cenários, e procura o valor ou o dono do limite em toda resposta que não seja da própria pessoa.",
    alternative: null,
    tradeoff:
      "Justificativas menos completas: \"cabe, mas no limite\" revelaria quase o valor. E, num grupo em que só uma pessoa declarou orçamento, quem souber disso por fora sabe de quem é o limite.",
    result:
      "Coberto por testes no motor e na API, que o CI roda em todo push contra um PostgreSQL de verdade.",
    nodes: ["api", "motor", "pg"],
  },
];
