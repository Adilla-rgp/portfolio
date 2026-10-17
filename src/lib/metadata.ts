import type { Metadata } from "next";
import { site } from "@/content/site";

/**
 * Next replaces `openGraph` objects instead of merging them with the layout's,
 * so every page builds its own from this base.
 */
export const baseOpenGraph = {
  type: "website",
  locale: site.ogLocale,
  siteName: site.name,
} as const;

interface PageMetadataOptions {
  path: string;
  /** Short page title, composed by the layout template; omit for the Home. */
  title?: string;
  description: string;
}

export function pageMetadata({ path, title, description }: PageMetadataOptions): Metadata {
  const fullTitle = title ? `${title} — ${site.name}` : site.title;
  return {
    ...(title && { title }),
    description,
    alternates: { canonical: path },
    openGraph: { ...baseOpenGraph, url: path, title: fullTitle, description },
  };
}
