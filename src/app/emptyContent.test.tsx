import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { cosmoCase } from "@/content/cases/cosmo";
import { caseStudyContent } from "@/content/caseStudy";
import { gallifreyCase, missionQuestions } from "@/content/cases/gallifrey";
import { meridianoCase } from "@/content/cases/meridiano";
import { recommendationCase, recommendationResearch } from "@/content/cases/recomendacao";
import { agentDecisions, cosmoDecisions, meridianoDecisions } from "@/content/decisions";
import { getProject } from "@/lib/projectPage";
import { CaseStudyPage } from "@/sections/project/case/CaseStudyPage";
import { CaseToday } from "@/sections/project/case/CaseToday";
import { DecisionDetails } from "@/sections/project/case/DecisionDetails";
import Home from "./page";
import AgentsPage from "./projetos/agentes/page";
import CosmoPage from "./projetos/cosmo/page";
import MeridianoPage from "./projetos/meridiano/page";
import GallifreyPage from "./projetos/gallifrey/page";
import { MissionPlayer } from "./projetos/gallifrey/_components/MissionPlayer";
import RecommendationPage from "./projetos/recomendacao/page";
import { RoleSection } from "./projetos/recomendacao/_components/RoleSection";
import AboutPage from "./sobre/page";

/**
 * Fields still waiting for real content are null. Whatever renders in their
 * place must not be a label, heading or button with nothing behind it.
 */

const copy = caseStudyContent.decisions;
const decisions = [...cosmoDecisions, ...agentDecisions, ...meridianoDecisions];
const noop = () => {};

function html(element: React.ReactElement): string {
  return renderToStaticMarkup(element);
}

describe("case study decisions", () => {
  it.each(decisions.map((decision, index) => [decision.id, decision, index] as const))(
    "%s shows the alternative, the trade-off and the result only when they exist",
    (_, decision, index) => {
      const markup = html(
        <DecisionDetails
          decision={decision}
          number={String(index + 1)}
          showAlternative={false}
          onToggleAlternative={noop}
        />,
      );

      expect(markup.includes(copy.notChosen)).toBe(decision.alternative !== null);
      expect(markup.includes(copy.flip.show)).toBe(decision.alternative !== null);
      expect(markup.includes(`>${copy.result}<`)).toBe(decision.result !== null);
      expect(markup.includes(`>${copy.tradeoff}<`)).toBe(decision.tradeoff !== null);
    },
  );
});

describe("case study today", () => {
  const { today } = cosmoCase;
  const [product] = today.links;
  const article = { label: "Ler mais ↗", href: null };

  it("drops every link button, and their column, while no link has a destination", () => {
    const markup = html(
      <CaseToday today={{ ...today, links: [{ ...product, href: null }, { ...article, href: null }] }} />,
    );
    expect(markup).not.toContain(product.label);
    expect(markup).not.toContain(article.label);
    expect(markup).not.toContain("<a");
  });

  it("shows only the links that have one", () => {
    const markup = html(
      <CaseToday
        today={{ ...today, links: [{ ...product, href: "https://example.com" }, article] }}
      />,
    );
    expect(markup).toContain(product.label);
    expect(markup).not.toContain(article.label);
  });
});

describe("Gallifrey mission", () => {
  it("hides the link to the decision log while the Cosmo case is not published", () => {
    const markup = html(<MissionPlayer questions={missionQuestions} whyHref={null} />);
    expect(markup).not.toContain(gallifreyCase.mission.product.why);
  });
});

describe("Recommendation role section", () => {
  const { role } = recommendationCase;

  it("disappears entirely when no card has content", () => {
    const markup = html(
      <RoleSection
        cards={[
          { title: role.exploration.title, lines: [null, null] },
          { title: role.training.title, lines: [null] },
        ]}
      />,
    );
    expect(markup).toBe("");
  });

  it("drops a card with no content, title included", () => {
    const markup = html(
      <RoleSection
        cards={[
          { title: role.exploration.title, lines: [role.exploration.body, null] },
          { title: role.training.title, lines: [null] },
        ]}
      />,
    );
    expect(markup).toContain(role.title);
    expect(markup).toContain(role.exploration.title);
    expect(markup).not.toContain(role.training.title);
  });
});

/**
 * Fails on what a reader would see as unfinished: a literal null/undefined,
 * a bracketed placeholder like "[dataset]" or "[— ms]", or a link to nowhere.
 * Python lists and indexes in the questions hold digits; the demo's [MASK]
 * token is real copy.
 */
function expectNoPlaceholders(markup: string) {
  expect(markup).not.toMatch(/>\s*null\s*</);
  expect(markup).not.toContain("undefined");
  expect(markup.replaceAll(recommendationCase.demo.mask, "")).not.toMatch(/\[[^\]<>"\d,]{1,40}\]/);
  expect(markup).not.toContain('href="#"');
}

describe("pages with today's content", () => {
  it.each([
    ["/projetos/cosmo", CosmoPage],
    ["/projetos/agentes", AgentsPage],
    ["/projetos/meridiano", MeridianoPage],
    ["/projetos/gallifrey", GallifreyPage],
    ["/projetos/recomendacao", RecommendationPage],
    ["/sobre", AboutPage],
  ] as const)("%s renders no placeholder or empty value", (_, Page) => {
    expectNoPlaceholders(html(<Page />));
  });

  it("/ renders no placeholder or empty value", () => {
    expectNoPlaceholders(html(<Home />));
  });

  it("drops the decisions section of a case study that has none", () => {
    const content = { ...meridianoCase, decisions: null };
    expect(html(<CaseStudyPage project={getProject("meridiano")} content={content} />)).not.toContain(
      `aria-label="${caseStudyContent.decisions.ariaLabel}"`,
    );
  });

  it("labels the dataset on the recommendation page only when it is known", () => {
    expect(html(<RecommendationPage />).includes(`${recommendationCase.role.exploration.datasetLabel}:`)).toBe(
      recommendationResearch.dataset !== null,
    );
  });
});
