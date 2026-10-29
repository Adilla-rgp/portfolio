import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { cosmoCase } from "@/content/cases/cosmo";
import { gallifreyCase, missionQuestions } from "@/content/cases/gallifrey";
import { recommendationCase } from "@/content/cases/recomendacao";
import { decisions } from "@/content/decisions";
import { lensParam, lenses } from "@/content/lens";
import Home from "./page";
import CosmoPage from "./projetos/cosmo/page";
import { CosmoToday } from "./projetos/cosmo/_components/CosmoToday";
import { DecisionDetails } from "./projetos/cosmo/_components/DecisionDetails";
import GallifreyPage from "./projetos/gallifrey/page";
import { MissionPlayer } from "./projetos/gallifrey/_components/MissionPlayer";
import RecommendationPage from "./projetos/recomendacao/page";
import { RoleSection } from "./projetos/recomendacao/_components/RoleSection";
import AboutPage from "./sobre/page";

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

describe("Cosmo today", () => {
  const [product] = cosmoCase.today.links;
  const article = { label: "Ler mais ↗", href: null };

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
    ["/projetos/gallifrey", GallifreyPage],
    ["/projetos/recomendacao", RecommendationPage],
    ["/sobre", AboutPage],
  ] as const)("%s renders no placeholder or empty value", (_, Page) => {
    expectNoPlaceholders(html(<Page />));
  });

  it.each(lenses)("/ with lens %s renders no placeholder or empty value", async (lens) => {
    const page = await Home({ searchParams: Promise.resolve({ [lensParam]: lens }) });
    expectNoPlaceholders(html(page));
  });

  it("does not label the dataset on the recommendation page while it is unknown", () => {
    expect(html(<RecommendationPage />)).not.toContain(
      `${recommendationCase.role.exploration.datasetLabel}:`,
    );
  });
});
