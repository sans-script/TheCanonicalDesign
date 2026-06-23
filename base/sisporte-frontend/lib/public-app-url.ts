/**
 * Origem pública desta aplicação Next.js — usada em QR codes e links que o celular deve abrir.
 *
 * **Produção:** defina `NEXT_PUBLIC_APP_URL` com o HTTPS público (ex.: `https://carteira.prefeitura.gov.br`).
 * O administrador acede ao painel por esse domínio; o QR aponta para o mesmo host e o celular só
 * precisa de internet (Wi‑Fi ou dados móveis), sem estar na mesma rede LAN que o computador.
 *
 * **Desenvolvimento:** em `http://localhost:3000` o telefone não consegue abrir "localhost".
 * Use `NEXT_PUBLIC_APP_URL=http://192.168.x.x:3000` (IP da máquina na LAN) ou um túnel (ngrok, etc.).
 *
 * Se `NEXT_PUBLIC_APP_URL` não estiver definido, usa-se `window.location.origin` (adequado quando
 * já se entra no painel pelo URL público correto).
 */
export function getPublicAppBaseUrl(): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (appUrl) {
    return appUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "";
}

export function isLikelyUnreachableMobileQr(): boolean {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  const isLocal =
    h === "localhost" ||
    h === "127.0.0.1" ||
    h === "[::1]" ||
    h.endsWith(".local");
  if (!isLocal) return false;
  return !process.env.NEXT_PUBLIC_APP_URL?.trim();
}
