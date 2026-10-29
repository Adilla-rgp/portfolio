/** How the tutoring agents' cache matches a new error against the ones it has seen. */
export const cacheSetup = {
  exactMatch: "MD5",
  similarity: "Jaccard",
  /** Minimum Jaccard similarity to reuse a cached answer. */
  threshold: 0.85,
  /** Range offered by the calculator's slider. */
  thresholdRange: { min: 0.5, max: 1 },
} as const;

export const submissionBase = {
  submissions: 16850,
  period: "nov/2024–jul/2026",
} as const;

/** Shares of the whole submissions base (0..1). */
export const submissionErrors = {
  withError: 0.771,
  errorCount: 12992,
  logic: 0.4897,
  runtime: 0.2813,
  /** Shares of the runtime errors only. */
  runtimeByException: [
    { label: "SyntaxError", value: 0.633 },
    { label: "IndentationError", value: 0.139 },
    { label: "NameError", value: 0.104 },
  ],
} as const;

export type RecoverySeries = "geral" | "sintaxe" | "logica";

export interface RecoveryPoint {
  /** Submissions in the cache's history. */
  baseSize: number;
  /** Share of errors answered from the cache (0..1). */
  rate: Record<RecoverySeries, number>;
}

/** Measured on the submissions base, with the threshold at 0,85. */
export const recoveryByBaseSize = [
  { baseSize: 1500, rate: { geral: 0.8824, sintaxe: 0.9216, logica: 0.7946 } },
  { baseSize: 3000, rate: { geral: 0.8926, sintaxe: 0.9268, logica: 0.8199 } },
  { baseSize: 16850, rate: { geral: 0.9685, sintaxe: 0.9614, logica: 0.9726 } },
] as const satisfies readonly RecoveryPoint[];

export type CachePresetId = "identicas" | "parecidas" | "diferentes" | "invertida";

export interface CachePreset {
  id: CachePresetId;
  label: string;
  /** The error the student just hit. */
  incoming: string;
  /** The error already in the cache. */
  cached: string;
  /** Shown under the verdict while this preset is untouched. */
  note?: string;
}

export const cachePresets = [
  {
    id: "identicas",
    label: "idênticas",
    incoming: "NameError: name 'total' is not defined",
    cached: "NameError: name 'total' is not defined",
  },
  {
    id: "parecidas",
    label: "parecidas",
    incoming: "IndentationError: expected an indented block after 'for' statement on line 3",
    cached: "IndentationError: expected an indented block after the 'for' statement on line 3",
  },
  {
    id: "diferentes",
    label: "diferentes",
    incoming: 'TypeError: can only concatenate str (not "int") to str',
    cached: "TypeError: unsupported operand type(s) for +: 'int' and 'str'",
  },
  {
    id: "invertida",
    label: "ordem invertida",
    incoming: "Expected False got True",
    cached: "Expected True got False",
    note: "O Jaccard ignora a ordem: os dois textos têm os mesmos tokens e empatam em 1,0. A triagem compara Expected e Got separadamente e barra o falso positivo.",
  },
] as const satisfies readonly CachePreset[];

export type CacheVerdict = "exact" | "similar" | "rejected" | "miss";

export const cacheContent = {
  presetsLabel: "Exemplos de mensagens",
  fields: {
    incoming: "Erro do aluno",
    cached: "Erro já no cache",
  },
  tokensLabel: (field: string) => `Tokens: ${field}`,
  sharedHint: "em comum",
  similarityLabel: "Similaridade de Jaccard",
  describeOverlap: (shared: number, union: number) =>
    `${shared} ${shared === 1 ? "token" : "tokens"} em comum de ${union}`,
  thresholdLabel: "Limiar",
  usedThresholdLabel: "limiar usado",
  describeThreshold: (threshold: string, similarity: string) =>
    `Limiar ${threshold}; similaridade ${similarity}`,
  triage: {
    label: "Triagem Expected/Got",
    options: [
      { value: "on", label: "ligada" },
      { value: "off", label: "desligada" },
    ],
  },
  verdicts: {
    exact: {
      title: "HIT exato",
      body: (similarity: string, threshold: string) =>
        `Mesmo hash ${cacheSetup.exactMatch}: a resposta em cache volta na hora. Jaccard ${similarity}, limiar ${threshold}.`,
    },
    similar: {
      title: "HIT por similaridade",
      body: (similarity: string, threshold: string) =>
        `Jaccard ${similarity} ≥ ${threshold}: o tutor reaproveita a resposta em cache.`,
    },
    rejected: {
      title: "REJEITADO PELA TRIAGEM",
      body: (similarity: string, threshold: string) =>
        `Jaccard ${similarity} ≥ ${threshold}, mas Expected ou Got diferem: a pergunta vai para o modelo.`,
    },
    miss: {
      title: "MISS",
      body: (similarity: string, threshold: string) =>
        `Jaccard ${similarity} < ${threshold}: a pergunta vai para o modelo.`,
    },
  } satisfies Record<
    CacheVerdict,
    { title: string; body: (similarity: string, threshold: string) => string }
  >,
  chart: {
    title: "Taxa de recuperação por tamanho da base",
    seriesLabel: "Tipo de erro",
    series: [
      { value: "geral", label: "geral" },
      { value: "sintaxe", label: "sintaxe" },
      { value: "logica", label: "lógica" },
    ],
    axisTitle: "submissões na base",
    legend: `dados reais da base de submissões, ${submissionBase.period}`,
    describe: (series: string, values: readonly string[]) =>
      `Taxa de recuperação do cache (${series}) por tamanho da base, com limiar 0,85: ${values.join("; ")}.`,
  },
} as const;

const decimal = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const integer = new Intl.NumberFormat("pt-BR");

export function formatSimilarity(value: number): string {
  return decimal.format(value);
}

export function formatRecovery(rate: number): string {
  return percent.format(rate);
}

export function formatShare(value: number, fractionDigits: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatCount(value: number): string {
  return integer.format(value);
}
