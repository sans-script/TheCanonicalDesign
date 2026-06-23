import api from "../lib/api";
import { getOrigin } from "../lib/public-url";
import { SignatureConfig } from "../lib/types";

const appendCacheBust = (url: string) => {
  const parsedUrl = new URL(url, getOrigin());
  parsedUrl.searchParams.set("v", Date.now().toString());
  return parsedUrl.toString();
};

const formatSignatureUrl = async (
  signatureUrl: string | null,
  cacheBust = false,
) => {
  if (!signatureUrl || signatureUrl.startsWith("data:")) {
    return signatureUrl;
  }

  const parsedUrl = new URL(signatureUrl, getOrigin());
  const uploadPath = parsedUrl.pathname.startsWith("/uploads")
    ? `${parsedUrl.pathname}${parsedUrl.search}`
    : null;

  if (uploadPath && !parsedUrl.searchParams.has("sig")) {
    const response = await api.get<{ url: string }>("/guards/signed-url", {
      params: { path: parsedUrl.pathname },
    });
    const signedUrl = `${getOrigin()}${response.data.url}`;
    return cacheBust ? appendCacheBust(signedUrl) : signedUrl;
  }

  return cacheBust
    ? appendCacheBust(parsedUrl.toString())
    : parsedUrl.toString();
};

export const settingsService = {
  async getSignature(): Promise<SignatureConfig> {
    const response = await api.get<SignatureConfig>("/settings/signature");
    const data = response.data;

    data.signatureUrl = await formatSignatureUrl(data.signatureUrl);

    return data;
  },

  async getPublicSignature(): Promise<SignatureConfig> {
    const response = await api.get<SignatureConfig>(
      "/validate/config/signature",
    );
    const data = response.data;

    // URL already pre-signed by backend — just absolutize if needed
    if (data.signatureUrl && !data.signatureUrl.startsWith("data:") && !data.signatureUrl.startsWith("http")) {
      data.signatureUrl = `${getOrigin()}${data.signatureUrl}`;
    }

    return data;
  },

  async saveSignature(
    signatureBase64: string | null,
    x: number,
    y: number,
    scale: number,
    shouldRemove: boolean = false,
  ): Promise<SignatureConfig> {
    const response = await api.post<SignatureConfig>("/settings/signature", {
      signatureBase64: shouldRemove ? "" : signatureBase64,
      x,
      y,
      scale,
      shouldRemove,
    });
    const data = response.data;

    data.signatureUrl = await formatSignatureUrl(data.signatureUrl, true);

    return data;
  },

  async createSignatureMobileSession(): Promise<{
    token: string;
    expiresAt: number;
    ttlSeconds: number;
  }> {
    const response = await api.post<{
      token: string;
      expiresAt: number;
      ttlSeconds: number;
    }>("/settings/signature/mobile-session", {});
    return response.data;
  },
};
