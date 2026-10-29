import type { SiteNavItem } from "@/components/layout/SiteHeader";

export interface ArchitectureNode {
  label: string;
  sub: string;
  /** Top-left corner in diagram units. */
  x: number;
  y: number;
  /** Page this node opens; null while that page is not published. */
  href?: string | null;
}

export interface Architecture<NodeId extends string = string> {
  /** viewBox size, in diagram units. */
  width: number;
  height: number;
  nodes: Record<NodeId, ArchitectureNode>;
  edges: readonly (readonly [NodeId, NodeId])[];
}

export interface Decision<NodeId extends string = string> {
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
  nodes: readonly NodeId[];
}

export interface CaseLink {
  label: string;
  /** Hidden until there is a real destination. */
  href: string | null;
}

/** A plain fact, or the slot where the project's live status is shown. */
export type CaseFact = { label: string; value: string } | { label: string; isStatus: true };

export interface CaseToday {
  id: string;
  title: string;
  /** null leaves only the tags and links. */
  body: string | null;
  tags: readonly string[];
  links: readonly CaseLink[];
}

export interface CaseDecisions<NodeId extends string = string> {
  title: string;
  /** Names the diagram for screen readers, e.g. "Arquitetura do Cosmo". */
  diagramName: string;
  items: readonly Decision<NodeId>[];
  architecture: Architecture<NodeId>;
}

export interface CaseDataBar {
  label: string;
  /** Share of the group's whole (0..1). */
  value: number;
}

export interface CaseDataGroup {
  title: string;
  bars: readonly CaseDataBar[];
  /** Decimal places the source reported, kept as given. */
  fractionDigits: number;
}

/** Measured numbers behind the decisions, drawn as horizontal bars. */
export interface CaseData {
  id: string;
  title: string;
  body: string;
  groups: readonly CaseDataGroup[];
}

/** Everything a case study page needs; the layout lives in CaseStudyPage. */
export interface CaseStudy<NodeId extends string = string> {
  meta: { title: string; description: string };
  nav: readonly SiteNavItem[];
  hero: {
    kicker: string;
    titleLines: readonly string[];
    titleSize?: "displayXl" | "displayPage";
    intro: string;
    facts: readonly CaseFact[];
  };
  /** null hides the whole decisions section, diagram included. */
  decisions: CaseDecisions<NodeId> | null;
  /** Omitted or null hides the data section. */
  data?: CaseData | null;
  today: CaseToday;
}

/** Copy and diagram geometry shared by every case study. */
export const caseStudyContent = {
  decisions: {
    ariaLabel: "Decisões",
    tabsLabel: "Escolha uma decisão",
    tour: { play: "▶ Tour automático", pause: "❚❚ Pausar tour" },
    diagramCaption: (num: string) => `Arquitetura · partes envolvidas na decisão ${num}`,
    describeDiagram: (name: string, num: string, parts: readonly string[]) =>
      `${name} com as partes da decisão ${num} destacadas: ${parts.join(", ")}.`,
    nodeLink: (label: string) => `${label} →`,
    decisionPrefix: "Decisão",
    chosen: "Escolhi",
    notChosen: "Não escolhi",
    flip: { show: "Ver o caminho não escolhido →", hide: "← Voltar à escolha" },
    tradeoff: "Trade-off",
    result: "Resultado",
  },
  /** Node and link geometry from Case.dc.html, in diagram units. */
  diagram: {
    node: {
      width: 170,
      height: 62,
      radius: 10,
      paddingX: 14,
      labelSize: 16,
      labelBaseline: 27,
      subSize: 11,
      subBaseline: 46,
    },
    stroke: { idle: 1.5, lit: 2.5 },
  },
} as const;
