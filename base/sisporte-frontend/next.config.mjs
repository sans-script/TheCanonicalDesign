/** Hostnames (sem porta) permitidos em `next dev` para HMR/WebSocket e Server Actions ao abrir pelo IP da LAN. */
function parseLanDevHostnames() {
  const fromList = process.env.DEV_ALLOWED_HOSTS?.trim()
    ? process.env.DEV_ALLOWED_HOSTS.split(/[,;\s]+/)
        .map((s) =>
          s
            .trim()
            .replace(/^https?:\/\//i, "")
            .split(":")[0]
            ?.trim(),
        )
        .filter(Boolean)
    : [];

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  let fromApp = null;
  if (appUrl) {
    try {
      const normalized = appUrl.includes("://") ? appUrl : `http://${appUrl}`;
      fromApp = new URL(normalized).hostname;
    } catch {
      /* ignore */
    }
  }

  return [...new Set([fromApp, ...fromList].filter(Boolean))];
}

const lanDevHostnames = parseLanDevHostnames();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.qrserver.com",
      },
    ],
  },
  // Origens extra em dev (hostname apenas, sem porta). Ver .env.example.
  allowedDevOrigins: ["127.0.0.1", ...lanDevHostnames],
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost", "127.0.0.1", ...lanDevHostnames],
    },
  },
};

export default nextConfig;
