export type MobileSessionStatus = "pending" | "completed";

export async function fetchPublicSignatureSession(token: string): Promise<{
  status: MobileSessionStatus;
  signatureBase64?: string;
}> {
  const res = await fetch(
    `/api/public/signature-session/${encodeURIComponent(token)}`,
    { method: "GET", cache: "no-store" },
  );
  if (res.status === 404) {
    throw new Error("Sessão não encontrada ou expirada.");
  }
  if (res.status === 410) {
    throw new Error("Sessão expirada.");
  }
  if (!res.ok) {
    throw new Error("Não foi possível consultar a sessão.");
  }
  return res.json();
}

export async function submitPublicSignatureSession(
  token: string,
  signatureBase64: string,
): Promise<void> {
  const res = await fetch(
    `/api/public/signature-session/${encodeURIComponent(token)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ signatureBase64 }),
    },
  );
  if (!res.ok) {
    let message = "Não foi possível enviar a assinatura.";
    try {
      const body = await res.json();
      if (body?.message) {
        message = Array.isArray(body.message)
          ? body.message.join(", ")
          : String(body.message);
      }
    } catch {}
    throw new Error(message);
  }
}
