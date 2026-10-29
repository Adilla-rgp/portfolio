import { homeContent } from "@/content/home";
import { getProjectHref, listedProjects, projectStatusText } from "@/content/projects";

export const homeApiPath = "/api/home";

/** Any value makes the URL unique, so the CDN never has it cached. */
export const cacheBustParam = "nocache";

/** Short CDN cache for the warm request; browsers always revalidate. */
export const warmCacheControl = "public, max-age=0, s-maxage=60";
export const coldCacheControl = "no-store";

/** Names of the internal stages reported in the Server-Timing header. */
export const serverStages = { content: "content", serialize: "serialize" } as const;

/** The Home copy, in the order the page shows it. */
export function buildHomePayload() {
  const { hero } = homeContent;
  return {
    hero: { kicker: hero.kicker, titleLines: hero.titleLines, intro: hero.intro },
    projects: listedProjects.map((project) => ({
      id: project.id,
      name: project.name,
      status: projectStatusText(project),
      href: getProjectHref(project),
      description: project.description,
      tags: project.tags,
    })),
  };
}

export function homeApiUrl(base: string, bustCache: string | null): URL {
  const url = new URL(homeApiPath, base);
  if (bustCache !== null) url.searchParams.set(cacheBustParam, bustCache);
  return url;
}
