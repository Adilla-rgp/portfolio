import type { CaseLink, CaseStudy } from "@/content/caseStudy";
import { projectPageContent } from "@/content/projectPage";

export const meridianoProductUrl = "https://meridiano2.vercel.app";

const productLink: CaseLink = { label: "Ver o Meridiano ↗", href: meridianoProductUrl };

/**
 * Built only from what the site already says about the Meridiano (work list
 * copy and stack map). Decisions, architecture and the "today" text stay null
 * until there is real content for them.
 */
export const meridianoCase: CaseStudy = {
  meta: {
    title: "Meridiano",
    description:
      "Meridiano: motor de decisão em Python e API em FastAPI que calculam a viagem mais justa para um grupo.",
  },
  nav: [
    { label: projectPageContent.homeNavLabel, href: projectPageContent.homeHref },
    { label: "Onde está hoje", href: "#hoje" },
  ],
  hero: {
    kicker: "Estudo de caso — Viagens em grupo",
    titleLines: ["Meridiano"],
    titleSize: "displayPage",
    intro:
      "Motor de decisão em Python e API em FastAPI que calculam a viagem mais justa para um grupo, com privacidade de orçamento garantida por testes. Texto livre vira restrições estruturadas: a IA interpreta, o motor decide.",
    facts: [{ label: "Status", isStatus: true }],
  },
  decisions: null,
  today: {
    id: "hoje",
    title: "Onde está hoje",
    body: null,
    tags: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "TypeScript", "React", "LLM"],
    links: [productLink],
  },
};
