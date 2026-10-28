const SHORT_SHA_LENGTH = 7;

/**
 * Short commit of the running deploy. Vercel sets VERCEL_GIT_COMMIT_SHA at
 * build and at runtime; anywhere else (local dev, CI) it is undefined.
 */
export function getDeployId(fallback: string): string {
  return process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, SHORT_SHA_LENGTH) || fallback;
}
