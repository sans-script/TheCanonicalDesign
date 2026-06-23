/**
 * Base URL of the Nest API as seen from the Next.js server (SSR, route handlers, proxy).
 * In Docker, set this to a hostname the Node process can reach (e.g. http://api:3001/api).
 */
export function getInternalApiRoot(): string {
  const raw = (
    process.env.INTERNAL_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "http://127.0.0.1:3001/api"
  ).replace(/\/$/, "");
  return raw.endsWith("/api") ? raw : `${raw}/api`;
}
