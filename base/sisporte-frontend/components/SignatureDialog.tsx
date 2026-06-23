"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import {
  Upload,
  Pencil,
  Smartphone,
  Move,
  Loader2,
} from "lucide-react";
import {
  SignaturePad,
  type SignaturePadHandle,
} from "@/components/SignaturePad";
import { QRCodeSVG } from "qrcode.react";
import { settingsService } from "@/services/settings.service";
import { fetchPublicSignatureSession } from "@/lib/signature-session-client";
import { getPublicAppBaseUrl } from "@/lib/public-app-url";
import { toast } from "sonner";
import { CardBack, GuardData } from "@/components/ServiceIdentityCard";
import { AuthenticatedImage } from "@/components/AuthenticatedImage";
import { cn } from "@/lib/utils";

const CARD_W = 540;
const CARD_H = 340;
const PREVIEW_SCALE = 1.1;

interface SignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignatureCollected: (base64: string, x?: number, y?: number, scale?: number) => void;
  title?: string;
  description?: string;
  cardData?: GuardData;
}

export function SignatureDialog({
  open,
  onOpenChange,
  onSignatureCollected,
  title = "Coletar Assinatura",
  description = "Escolha como deseja coletar a assinatura digital.",
  cardData,
}: SignatureDialogProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "draw" | "mobile">("upload");
  const [signatureBase64, setSignatureBase64] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Position adjustments
  const [x, setX] = useState(cardData?.serverSignatureX ?? 360);
  const [y, setY] = useState(cardData?.serverSignatureY ?? 220);
  const [scale, setScale] = useState(cardData?.serverSignatureScale ?? 1.0);

  const [isDraggingSig, setIsDraggingSig] = useState(false);
  const [dragStartMouse, setDragStartMouse] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [responsivePreviewScale, setResponsivePreviewScale] = useState(1);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const padRef = useRef<SignaturePadHandle>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const previewContentRef = useRef<HTMLDivElement>(null);

  const previewW = CARD_W * PREVIEW_SCALE;
  const previewH = CARD_H * PREVIEW_SCALE;

  const clearPoll = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  // Update initial positioning if cardData changes while dialog is open or reopened
  useEffect(() => {
    if (open && cardData) {
      setX(cardData.serverSignatureX ?? 360);
      setY(cardData.serverSignatureY ?? 220);
      setScale(cardData.serverSignatureScale ?? 1.0);
    }
    if (!open) {
      setSignatureBase64(null);
    }
  }, [open, cardData]);

  useEffect(() => {
    if (!open || activeTab !== "mobile") {
      clearPoll();
      setSessionToken(null);
      return;
    }

    let cancelled = false;
    const createSession = async () => {
      try {
        const { token } = await settingsService.createSignatureMobileSession();
        if (!cancelled) setSessionToken(token);
      } catch {
        if (!cancelled) {
          toast.error("Não foi possível criar o link para o celular.");
          setActiveTab("upload");
        }
      }
    };

    createSession();
    return () => {
      cancelled = true;
    };
  }, [open, activeTab, clearPoll]);

  useEffect(() => {
    if (activeTab !== "mobile" || !sessionToken || !open) return;

    const tick = async () => {
      try {
        const data = await fetchPublicSignatureSession(sessionToken);
        if (data.status === "completed" && data.signatureBase64) {
          clearPoll();
          if (cardData) {
            setSignatureBase64(data.signatureBase64);
            toast.success("Assinatura recebida do celular! Ajuste o posicionamento.");
          } else {
            onSignatureCollected(data.signatureBase64);
            toast.success("Assinatura recebida!");
            onOpenChange(false);
          }
        }
      } catch (err) {
        if (
          err instanceof Error &&
          (err.message.includes("expirado") ||
            err.message.includes("não é mais válido"))
        ) {
          clearPoll();
          const { token } = await settingsService.createSignatureMobileSession();
          setSessionToken(token);
        }
      }
    };

    pollRef.current = setInterval(() => void tick(), 2000);
    return clearPoll;
  }, [activeTab, sessionToken, open, onSignatureCollected, onOpenChange, clearPoll, cardData]);

  // Drag logic
  const handleSigMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingSig(true);
    setDragStartMouse({ x: e.clientX, y: e.clientY });
    setDragStartPos({ x, y });
  };

  useEffect(() => {
    if (!isDraggingSig) return;

    const onMove = (e: MouseEvent) => {
      const deltaX = (e.clientX - dragStartMouse.x) / (PREVIEW_SCALE * responsivePreviewScale);
      const deltaY = (e.clientY - dragStartMouse.y) / (PREVIEW_SCALE * responsivePreviewScale);

      let newX = Math.round(dragStartPos.x + deltaX);
      let newY = Math.round(dragStartPos.y + deltaY);

      newX = Math.max(0, Math.min(newX, CARD_W));
      newY = Math.max(0, Math.min(newY, CARD_H));

      setX(newX);
      setY(newY);
    };
    const onUp = () => setIsDraggingSig(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDraggingSig, dragStartMouse, dragStartPos, responsivePreviewScale]);

  // Responsive scale
  useEffect(() => {
    const el = previewContentRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const available = Math.max(entry.contentRect.width - 32, 0);
      const nextScale = Math.min(Math.max(available / previewW, 0.3), 1);
      setResponsivePreviewScale(nextScale);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [previewW]);

  const handleWheel = (e: React.WheelEvent) => {
    if (!signatureBase64 && !cardData?.serverSignatureUrl) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setScale((prev) => Math.max(0.1, Math.min(3.0, prev + delta)));
  };

  useEffect(() => {
    const el = document.getElementById("dialog-preview-container");
    const onWheel = (e: WheelEvent) => {
      if (signatureBase64 || cardData?.serverSignatureUrl) e.preventDefault();
    };
    el?.addEventListener("wheel", onWheel, { passive: false });
    return () => el?.removeEventListener("wheel", onWheel);
  }, [signatureBase64, cardData]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Apenas imagens são aceitas.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (cardData) {
          setSignatureBase64(result);
        } else {
          onSignatureCollected(result);
          onOpenChange(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const applyPad = () => {
    if (!padRef.current || padRef.current.isEmpty()) {
      toast.error("Desenhe a assinatura primeiro.");
      return;
    }
    const data = padRef.current.toDataURL();
    if (cardData) {
      setSignatureBase64(data);
      toast.success("Assinatura aplicada. Ajuste o tamanho e a posição antes de salvar.");
    } else {
      onSignatureCollected(data);
      onOpenChange(false);
    }
  };

  const handleSaveAdjustments = () => {
    const finalSignature = signatureBase64 || cardData?.serverSignatureUrl || "";
    if (!finalSignature) {
      toast.error("Nenhuma assinatura coletada.");
      return;
    }
    onSignatureCollected(finalSignature, x, y, scale);
    onOpenChange(false);
  };

  const activeSig = signatureBase64 || cardData?.serverSignatureUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-[500px] max-h-[90vh] overflow-y-auto custom-scrollbar", cardData && "xl:max-w-[1300px] w-[95vw]")}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </DialogHeader>

        <div className={cn("flex flex-col gap-6", cardData && "xl:flex-row xl:items-stretch")}>
          {cardData && (
            <div className="flex-1 flex flex-col bg-slate-50/50 border border-slate-200 rounded-lg overflow-hidden relative">
              <div className="bg-slate-50 border-b border-slate-100 p-3 shrink-0 flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Move className="h-4 w-4 text-primary" />
                  Visualização e Posicionamento
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Verso da Carteira</span>
              </div>
              <div
                ref={previewContentRef}
                className="flex-1 p-4 flex items-center justify-center min-w-0 min-h-[340px] xl:min-h-[420px]"
              >
                <div
                  id="dialog-preview-container"
                  onWheel={handleWheel}
                  className="relative shrink-0"
                  style={{
                    width: previewW * responsivePreviewScale,
                    height: previewH * responsivePreviewScale,
                  }}
                >
                  <div
                    className="relative rounded-lg overflow-hidden select-none shadow-xl"
                    style={{
                      width: previewW,
                      height: previewH,
                      transform: `scale(${responsivePreviewScale})`,
                      transformOrigin: "top left",
                    }}
                  >
                    <div
                      style={{
                        transform: `scale(${PREVIEW_SCALE})`,
                        transformOrigin: "top left",
                        width: CARD_W,
                        height: CARD_H,
                        position: "absolute",
                        top: 0,
                        left: 0,
                      }}
                    >
                      <CardBack data={{ ...cardData, serverSignatureUrl: null }} isPublic={false} isPrinting={false} />

                      {activeSig && (
                        <div
                          className={`absolute cursor-move rounded-md transition-colors border-2 border-dashed box-border ${
                            isDraggingSig ? "border-primary bg-primary/10" : "border-transparent hover:border-primary/40"
                          }`}
                          style={{
                            left: x,
                            top: y,
                            transform: `translate(-50%, -50%) scale(${scale})`,
                            zIndex: 30,
                          }}
                          onMouseDown={handleSigMouseDown}
                          title="Arraste para mover"
                        >
                          <AuthenticatedImage
                            src={activeSig}
                            alt="Assinatura"
                            style={{
                              height: "40px",
                              width: "auto",
                              maxWidth: "100%",
                              opacity: 1, // Full opacity since we removed it from CardBack
                              pointerEvents: "none",
                              objectFit: "contain",
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {activeSig && (
                      <div className="absolute top-3 right-3 bg-slate-900/70 text-white text-[11px] font-medium px-3 py-1.5 rounded-full pointer-events-none flex items-center gap-1.5 shadow-lg backdrop-blur-md z-40">
                        <Move className="h-3.5 w-3.5" />
                        Arraste para mover • Scroll para zoom
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col w-full xl:w-[550px] shrink-0">
            <div className="flex p-1 bg-slate-100 rounded-lg mb-4">
              <button
                onClick={() => setActiveTab("upload")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${
                  activeTab === "upload" ? "bg-white text-primary shadow-sm" : "text-slate-500"
                }`}
              >
                <Upload className="h-3.5 w-3.5" />
                Upload
              </button>
              <button
                onClick={() => setActiveTab("draw")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${
                  activeTab === "draw" ? "bg-white text-primary shadow-sm" : "text-slate-500"
                }`}
              >
                <Pencil className="h-3.5 w-3.5" />
                Manual
              </button>
              <button
                onClick={() => setActiveTab("mobile")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${
                  activeTab === "mobile" ? "bg-white text-primary shadow-sm" : "text-slate-500"
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                Celular
              </button>
            </div>
            <div className="flex flex-col items-stretch justify-center overflow-hidden h-[420px] shrink-0">
              {activeTab === "upload" && (
                <div
                  className="relative flex-1 flex flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-slate-200 bg-slate-50 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all duration-200 select-none w-full h-full animate-in fade-in slide-in-from-top-2 duration-300"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-center px-4">
                    <p className="text-sm font-medium text-slate-700">Clique para selecionar imagem</p>
                    <p className="text-[11px] text-muted-foreground mt-1.5">
                      Formatos aceitos: PNG (com fundo transparente recomendado).
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              )}

              {activeTab === "draw" && (
                <div className="flex-1 flex flex-col h-full space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex-1 w-full max-w-full min-w-0 overflow-hidden rounded-md bg-white border border-slate-200 flex flex-col items-stretch shadow-inner relative group">
                    <div className="relative flex-1 min-h-[200px] w-full max-w-full">
                      <SignaturePad ref={padRef} strokeWidth={2.5} className="h-full w-full border-0" />
                      <div className="absolute left-6 right-6 bottom-[28%] h-0.5 border-b-2 border-dashed border-slate-300 pointer-events-none" />
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 h-11"
                      onClick={() => padRef.current?.clear()}
                    >
                      Limpar assinatura
                    </Button>
                    <Button type="button" className="flex-1 h-11" onClick={applyPad}>
                      Usar assinatura
                    </Button>
                  </div>
                  <p className="shrink-0 text-[11px] text-center text-muted-foreground leading-relaxed px-4">
                    O servidor deve desenhar a assinatura no quadro acima.
                  </p>
                </div>
              )}

              {activeTab === "mobile" && (
                <div className="flex-1 flex flex-col w-full h-full items-center justify-center space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  {sessionToken ? (
                    <>
                      <div className="p-0">
                        <QRCodeSVG
                          value={`${getPublicAppBaseUrl()}/sign/${sessionToken}`}
                          size={200}
                          level="M"
                          includeMargin={false}
                        />
                      </div>
                      <p className="text-[11px] text-center text-muted-foreground leading-relaxed px-4 max-w-[280px]">
                        Escaneie o QR Code com seu celular para assinar usando a tela touch. Esse link expira em 15 minutos.
                      </p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-muted-foreground text-sm py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span>Preparando link seguro…</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {cardData && (
              <Button
                type="button"
                className="w-full h-11 mt-4"
                onClick={handleSaveAdjustments}
                disabled={!activeSig}
              >
                Salvar Assinatura e Posição
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
