import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { cosmoCase } from "@/content/cases/cosmo";
import { gallifreyCase, missionQuestions } from "@/content/cases/gallifrey";
import { recommendationCase } from "@/content/cases/recomendacao";
import { decisions } from "@/content/decisions";
import CosmoPage from "./cosmo/page";
import { CosmoToday } from "./cosmo/_components/CosmoToday";
import { DecisionDetails } from "./cosmo/_components/DecisionDetails";
import GallifreyPage from "./gallifrey/page";
import { MissionPlayer } from "./gallifrey/_components/MissionPlayer";
import RecommendationPage from "./recomendacao/page";
import { RoleSection } from "./recomendacao/_components/RoleSection";

/**
 * Fields still waiting for real content are null. Whatever renders in their
 * place must not be a label, heading or button with nothing behind it.
 */

const copy = cosmoCase.decisions;
const noop = () => {};

function html(element: React.ReactElement): string {
  return renderToStaticMarkup(element);
}

describe("Cosmo decisions", () => {
  it.each(decisions.map((decision, index) => [decision.id, decision, index] as const))(
    "%s shows the alternative and the result only when they exist",
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
      expect(markup).toContain(copy.tradeoff);
    },
  );
});

describe("Cosmo today", () => {
  const [product, article] = cosmoCase.today.links;

  it("drops every link button, and their column, while no link has a destination", () => {
    const markup = html(
      <CosmoToday links={[{ ...product, href: null }, { ...article, href: null }]} />,
    );
    expect(markup).not.toContain(product.label);
    expect(markup).not.toContain(article.label);
    expect(markup).not.toContain("<a");
  });

  it("shows only the links that have one", () => {
    const markup = html(
      <CosmoToday links={[{ ...product, href: "https://example.com" }, { ...article, href: null }]} />,
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

describe("case pages with today's content", () => {
  it.each([
    ["cosmo", CosmoPage],
    ["gallifrey", GallifreyPage],
    ["recomendacao", RecommendationPage],
  ] as const)("/projetos/%s renders no placeholder or empty value", (_, Page) => {
    const markup = html(<Page />);
    expect(markup).not.toMatch(/>\s*null\s*</);
    expect(markup).not.toContain("undefined");
    // Bracketed placeholders like "[dataset]" or "[— ms]". Python lists and
    // indexes in the questions hold digits; the demo's [MASK] token is real copy.
    expect(markup.replaceAll(recommendationCase.demo.mask, "")).not.toMatch(/\[[^\]<>"\d,]{1,40}\]/);
    expect(markup).not.toContain('href="#"');
  });

  it("does not label the dataset on the recommendation page while it is unknown", () => {
    expect(html(<RecommendationPage />)).not.toContain(
      `${recommendationCase.role.exploration.datasetLabel}:`,
    );
  });
});
