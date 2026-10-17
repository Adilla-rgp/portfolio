export interface ThresholdPoint {
  /** Minimum Jaccard similarity to reuse a cached answer (0..1). */
  threshold: number;
  /** Share of requests answered from cache (0..1). */
  cacheHitRate: number;
  /** Share of reused answers that were wrong for the student (0..1). */
  wrongReuseRate: number;
}

// Illustrative curves from docs/design-reference/Home.dc.html, sampled at 0.01
// from 0.50 to 0.95. Replace `thresholdPoints` with the measured Cosmo data;
// the chart reads only this array.
const MIN_THRESHOLD = 0.5;
const MAX_THRESHOLD = 0.95;
const STEP = 0.01;
const SAMPLES = Math.round((MAX_THRESHOLD - MIN_THRESHOLD) / STEP) + 1;

function illustrativeHitRate(threshold: number) {
  return 0.86 * (1 - Math.pow((threshold - MIN_THRESHOLD) / (MAX_THRESHOLD - MIN_THRESHOLD), 1.6)) + 0.04;
}

function illustrativeWrongRate(threshold: number) {
  return 0.32 * Math.exp(-(threshold - MIN_THRESHOLD) * 10.5) + 0.005;
}

export const thresholdPoints: readonly ThresholdPoint[] = Array.from(
  { length: SAMPLES },
  (_, index) => {
    const threshold = Math.round((MIN_THRESHOLD + index * STEP) * 100) / 100;
    return {
      threshold,
      cacheHitRate: illustrativeHitRate(threshold),
      wrongReuseRate: illustrativeWrongRate(threshold),
    };
  },
);

export const thresholdIsIllustrative = true;

export const thresholdContent = {
  defaultThreshold: 0.72,
  stats: {
    hits: "Acertos de cache",
    wrong: "Reuso errado",
  },
  /** Zone rules, checked in order. */
  zones: {
    tooEager: { wrongAbove: 0.08, text: "→ economiza muito, mas o aluno recebe feedback de outro erro." },
    tooSafe: { hitBelow: 0.25, text: "→ seguro, mas quase toda pergunta vai para o LLM." },
    balanced: { text: "→ zona de equilíbrio: é aqui que a decisão de verdade acontece." },
  },
  axis: {
    yTicks: [
      { value: 1, label: "100%" },
      { value: 0.5, label: "50%" },
      { value: 0, label: "0" },
    ],
    xTitle: "similaridade de Jaccard mínima",
  },
  rangeLabel: "Limiar",
  legend: {
    hits: "acertos de cache",
    wrong: "reuso errado",
  },
  note: "[curvas ilustrativas: os dados reais do Cosmo entram aqui]",
} as const;

const decimal = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatThreshold(threshold: number): string {
  return decimal.format(threshold);
}

export function formatRate(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

export function describeThreshold(point: ThresholdPoint): string {
  const prefix = thresholdIsIllustrative ? "Gráfico ilustrativo" : "Gráfico";
  return `${prefix}: com limiar ${formatThreshold(point.threshold)}, acertos de cache em ${formatRate(point.cacheHitRate)} e reuso errado em ${formatRate(point.wrongReuseRate)}.`;
}

export function describeRangeValue(point: ThresholdPoint): string {
  return `${formatThreshold(point.threshold)}: acertos ${formatRate(point.cacheHitRate)}, reuso errado ${formatRate(point.wrongReuseRate)}`;
}

export function getZoneText(point: ThresholdPoint): string {
  const { zones } = thresholdContent;
  if (point.wrongReuseRate > zones.tooEager.wrongAbove) return zones.tooEager.text;
  if (point.cacheHitRate < zones.tooSafe.hitBelow) return zones.tooSafe.text;
  return zones.balanced.text;
}
