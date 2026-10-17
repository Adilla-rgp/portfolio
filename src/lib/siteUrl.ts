const LOCAL_URL = "http://localhost:3000";

/**
 * Absolute origin for canonicals, Open Graph and the sitemap. Set
 * NEXT_PUBLIC_SITE_URL once the domain exists; on Vercel the production
 * domain is picked up automatically until then.
 */
function resolveSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return new URL(`https://${vercel}`);
  return new URL(LOCAL_URL);
}

export const siteUrl = resolveSiteUrl();
