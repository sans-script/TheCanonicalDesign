const FALLBACK_ORIGIN = "http://localhost:3001";

export function getOrigin() {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!configuredUrl || configuredUrl === "/api") {
    return typeof window !== "undefined" ? window.location.origin : FALLBACK_ORIGIN;
  }

  try {
    return new URL(configuredUrl, typeof window !== "undefined" ? window.location.origin : FALLBACK_ORIGIN).origin;
  } catch {
    if (configuredUrl.startsWith("/")) {
      return typeof window !== "undefined" ? window.location.origin : FALLBACK_ORIGIN;
    }

    return configuredUrl.replace(/\/api\/?$/, "");
  }
}