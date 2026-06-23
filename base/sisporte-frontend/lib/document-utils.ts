import { guardsService } from "../services/guards.service";
import { getOrigin } from "./public-url";

export async function handleViewDocument(url: string) {
  if (!url) return;

  try {
    const signedUrlPath = await guardsService.getSignedUrl(url);
    const fullUrl = `${getOrigin()}${signedUrlPath}`;

    window.open(fullUrl, "_blank");
  } catch (error) {
    console.error("Failed to view protected document:", error);
    alert("Não foi possível abrir o documento. Verifique se você está logado.");
  }
}
