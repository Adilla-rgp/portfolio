import type { MetadataRoute } from "next";
import { aboutContent } from "@/content/about";
import { siteUrl } from "@/lib/siteUrl";

/** Public routes only; /dev/ui is a development page and stays out. */
const routes = ["/", aboutContent.meta.path] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: new URL(route, siteUrl).toString(),
  }));
}
