import { homeContent } from "@/content/home";
import { lensParam, type Lens } from "@/content/lens";
import { getProjectHref, listedProjects, projectStatusText } from "@/content/projects";

export const homeApiPath = "/api/home";

/** Any value makes the URL unique, so the CDN never has it cached. */
export const cacheBustParam = "nocache";

/** Short CDN cache for the warm request; browsers always revalidate. */
export const warmCacheControl = "public, max-age=0, s-maxage=60";
export const coldCacheControl = "no-store";

/** Names of the internal stages reported in the Server-Timing header. */
export const serverStages = { content: "content", serialize: "serialize" } as const;

/** The Home copy for one lens, in the order the page shows it. */
export function buildHomePayload(lens: Lens) {
  const { hero } = homeContent;
  return {
    lens,
    hero: { kicker: hero.kicker[lens], titleLines: hero.titleLines, intro: hero.intro[lens] },
    projects: [...listedProjects]
      .sort((a, b) => a.order[lens] - b.order[lens])
      .map((project) => ({
        id: project.id,
        name: project.name,
        status: projectStatusText(project),
        href: getProjectHref(project),
        ...project.copy[lens],
      })),
  };
}

export function homeApiUrl(base: string, lens: Lens, bustCache: string | null): URL {
  const url = new URL(homeApiPath, base);
  url.searchParams.set(lensParam, lens);
  if (bustCache !== null) url.searchParams.set(cacheBustParam, bustCache);
  return url;
}
