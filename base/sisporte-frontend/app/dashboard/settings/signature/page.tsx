"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { toast } from "sonner";
import {
  Upload,
  Trash2,
  Save,
  Move,
  ZoomIn,
  ZoomOut,
  Pencil,
  Smartphone,
  RefreshCw,
  Copy,
  Loader2,
} from "lucide-react";
import { settingsService } from "@/services/settings.service";
import { authService } from "@/services/auth.service";
import { CardBack, GuardData } from "@/components/ServiceIdentityCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  SignaturePad,
  type SignaturePadHandle,
} from "@/components/SignaturePad";
import { QRCodeSVG } from "qrcode.react";
import { fetchPublicSignatureSession } from "@/lib/signature-session-client";
import {
  getPublicAppBaseUrl,
  isLikelyUnreachableMobileQr,
} from "@/lib/public-app-url";

const CARD_W = 540;
const CARD_H = 340;
const PREVIEW_SCALE = 1.1;

export default function SignatureSettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const previewContentRef = useRef<HTMLDivElement>(null);

  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [signatureBase64, setSignatureBase64] = useState<string | null>(null); // new upload (not yet saved)

  const [x, setX] = useState(270);
  const [y, setY] = useState(290);
  const [scale, setScale] = useState(1.0);

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [shouldRemove, setShouldRemove] = useState(false);
  const [initialConfig, setInitialConfig] = useState<{
    x: number;
    y: number;
    scale: number;
    signatureUrl: string | null;
  } | null>(null);

  const [isDraggingSig, setIsDraggingSig] = useState(false);
  const [dragStartMouse, setDragStartMouse] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [responsivePreviewScale, setResponsivePreviewScale] = useState(1);

  const previewW = CARD_W * PREVIEW_SCALE;
  const previewH = CARD_H * PREVIEW_SCALE;

  const padRef = useRef<SignaturePadHandle>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "draw" | "mobile">(
    "upload",
  );
  const [qrOpen, setQrOpen] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [router]);

  useEffect(() => {
    async function load() {
      try {
        const config = await settingsService.getSignature();
        if (config.signatureUrl) {
          setSignatureUrl(config.signatureUrl);
        }
        setX(config.x ?? 270);
        setY(config.y ?? 290);
        setScale(config.scale ?? 1.0);
        setInitialConfig({
          x: config.x ?? 270,
          y: config.y ?? 290,
          scale: config.scale ?? 1.0,
          signatureUrl: config.signatureUrl || null,
        });
      } catch {
        toast.error("Erro ao carregar assinatura atual.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Apenas imagens são aceitas.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSignatureBase64(result);
      setSignatureUrl(result);
      setShouldRemove(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleSigMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingSig(true);
    setDragStartMouse({ x: e.clientX, y: e.clientY });
    setDragStartPos({ x, y });
  };

  useEffect(() => {
    if (!isDraggingSig) return;

    const onMove = (e: MouseEvent) => {
      const deltaX =
        (e.clientX - dragStartMouse.x) /
        (PREVIEW_SCALE * responsivePreviewScale);
      const deltaY =
        (e.clientY - dragStartMouse.y) /
        (PREVIEW_SCALE * responsivePreviewScale);

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
    if (!signatureUrl) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setScale((prev) => Math.max(0.1, Math.min(3.0, prev + delta)));
  };

  useEffect(() => {
    const el = document.getElementById("preview-container");
    const onWheel = (e: WheelEvent) => {
      if (signatureUrl) e.preventDefault();
    };
    el?.addEventListener("wheel", onWheel, { passive: false });
    return () => el?.removeEventListener("wheel", onWheel);
  }, [signatureUrl]);

  const hasChanges =
    signatureBase64 !== null ||
    shouldRemove ||
    (initialConfig &&
      (x !== initialConfig.x ||
        y !== initialConfig.y ||
        scale !== initialConfig.scale));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await settingsService.saveSignature(
        signatureBase64,
        x,
        y,
        scale,
        shouldRemove,
      );
      toast.success(
        shouldRemove
          ? "Assinatura removida com sucesso!"
          : "Assinatura salva com sucesso!",
      );
      setSignatureBase64(null);
      setShouldRemove(false);
      setSignatureUrl(result.signatureUrl || null);
      setInitialConfig({
        x: result.x,
        y: result.y,
        scale: result.scale,
        signatureUrl: result.signatureUrl || null,
      });
      setX(result.x);
      setY(result.y);
      setScale(result.scale);
    } catch {
      toast.error("Erro ao salvar a assinatura. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = () => {
    setSignatureUrl(null);
    setSignatureBase64(null);
    setShouldRemove(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearPoll = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (activeTab !== "mobile") {
      clearPoll();
      setSessionToken(null);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const { token } = await settingsService.createSignatureMobileSession();
        if (!cancelled) setSessionToken(token);
      } catch {
        if (!cancelled) {
          toast.error("Não foi possível criar o link para o celular.");
          setActiveTab("upload");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "mobile" || !sessionToken) return;
    clearPoll();
    const tick = async () => {
      try {
        const data = await fetchPublicSignatureSession(sessionToken);
        if (data.status === "completed" && data.signatureBase64) {
          clearPoll();
          setSignatureBase64(data.signatureBase64);
          setSignatureUrl(data.signatureBase64);
          setShouldRemove(false);
          toast.success("Assinatura recebida!");
          setActiveTab("upload");
        }
      } catch (err) {
        if (
          err instanceof Error &&
          (err.message.includes("expirado") ||
            err.message.includes("não é mais válido"))
        ) {
          clearPoll();
          try {
            const { token } =
              await settingsService.createSignatureMobileSession();
            setSessionToken(token);
            toast("Link expirado. Novo QR code gerado.", {
              description: "Escaneie o novo código",
              duration: 3000,
            });
          } catch {
            toast.error("Erro ao gerar novo link.");
            setSessionToken(null);
          }
        }
      }
    };
    pollRef.current = setInterval(() => void tick(), 1500);
    void tick();
    return clearPoll;
  }, [activeTab, sessionToken, clearPoll]);

  const applyPadToSignature = () => {
    if (!padRef.current || padRef.current.isEmpty()) {
      toast.error("Desenhe algo antes de aplicar.");
      return;
    }
    const data = padRef.current.toDataURL();
    setSignatureBase64(data);
    setSignatureUrl(data);
    setShouldRemove(false);
    toast.success("Desenho aplicado à pré-visualização.");
  };

  const copyMobileLink = async () => {
    if (!sessionToken) return;
    const url = `${getPublicAppBaseUrl()}/sign/${sessionToken}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado.");
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  };

  const regenerateMobileSession = async () => {
    clearPoll();
    setSessionToken(null);
    try {
      const { token } = await settingsService.createSignatureMobileSession();
      setSessionToken(token);
      toast("Novo link gerado.");
    } catch {
      toast.error("Não foi possível gerar um novo link.");
    }
  };

  const mockData: GuardData = useMemo(
    () => ({
      name: "",
      registrationNumber: "",
      admissionDate: "",
      role: "",
      rank: "",
      cardIssuingPlace: "",
      cardIssuingDate: "",
      serial: "",
      sinarmNumber: "",
      expirationDate: "",
      birthPlace: "",
      state: "",
      birthDate: "",
      bloodType: "",
      rg: "",
      cpf: "",
      filiation: { fatherName: "", motherName: "" },
      qrCodeUrl: "",
      weaponCarryStatus: "active",
      signatureUrl: signatureUrl || undefined,
      signatureX: x,
      signatureY: y,
      signatureScale: scale,
    }),
    [signatureUrl, x, y, scale],
  );

  if (isLoading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-[10px] font-bold text-primary tracking-[0.3em] uppercase opacity-40">
          Buscando Registros
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full xl:h-full space-y-6 xl:overflow-hidden">
      {}
      <div className="shrink-0 space-y-1.5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Assinatura do Secretário</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-bold text-primary">
          Assinatura do Secretário
        </h1>
        <p className="text-sm text-muted-foreground">
          Envie uma imagem com a assinatura em fundo transparente, desenhe com o
          mouse na tela ou use o celular por um link único via QR code. Depois
          ajuste a posição na carteira e salve
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-stretch flex-1 xl:h-0 min-w-0 max-w-full">
        {}
        <div className="flex-1 min-w-0 w-full max-w-full xl:max-w-[850px]">
          <Card className="shadow-sm border-slate-200 overflow-hidden flex flex-col xl:h-full">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4 shrink-0">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Move className="h-4 w-4 text-primary" />
                Visualização e Posicionamento
              </CardTitle>
              <CardDescription>
                {signatureUrl
                  ? "Arraste a assinatura diretamente no cartão para ajustar a posição final da impressão."
                  : "Faça o upload de uma imagem ao lado para visualizar e ajustar seu posicionamento no cartão."}
              </CardDescription>
            </CardHeader>
            <CardContent
              ref={previewContentRef}
              className="flex-1 p-4 sm:p-6 xl:p-8 bg-slate-50/50 flex justify-center items-center min-w-0 overflow-visible custom-scrollbar"
            >
              <div className="flex flex-col items-center justify-center w-full min-w-0 overflow-visible">
                <div
                  id="preview-container"
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
                      <CardBack
                        data={mockData}
                        isPublic={false}
                        isPrinting={false}
                      />

                      {signatureUrl && (
                        <div
                          className={`absolute cursor-move rounded-md transition-colors border-2 border-dashed box-border ${isDraggingSig ? "border-primary bg-primary/10" : "border-transparent hover:border-primary/40"}`}
                          style={{
                            left: x,
                            top: y,
                            transform: `translate(-50%, -50%) scale(${scale})`,
                            zIndex: 30,
                          }}
                          onMouseDown={handleSigMouseDown}
                          title="Arraste para mover"
                        >
                          {}
                          <img
                            src={signatureUrl}
                            alt=""
                            style={{
                              height: "48px",
                              width: "auto",
                              maxWidth: "100%",
                              opacity: 0,
                              pointerEvents: "none",
                              objectFit: "contain",
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {signatureUrl && (
                      <div className="absolute top-3 right-3 bg-slate-900/70 text-white text-[11px] font-medium px-3 py-1.5 rounded-full pointer-events-none flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                        <Move className="h-3.5 w-3.5" />
                        Arraste para mover • Scroll para zoom
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {}
        <Card className="flex-1 min-w-0 max-w-full shadow-sm border-slate-200 flex flex-col xl:h-full">
          <CardHeader className="pb-0 shrink-0">
            <CardTitle className="text-base font-medium">Assinatura</CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col min-h-0 min-w-0">
            <div className="flex p-1 bg-slate-100 rounded-lg mb-6 shrink-0">
              <button
                onClick={() => setActiveTab("upload")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${
                  activeTab === "upload"
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Upload className="h-3.5 w-3.5" />
                Upload
              </button>
              <button
                onClick={() => setActiveTab("draw")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${
                  activeTab === "draw"
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Pencil className="h-3.5 w-3.5" />
                Manual
              </button>
              <button
                onClick={() => setActiveTab("mobile")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${
                  activeTab === "mobile"
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                Celular
              </button>
            </div>

            <div className="flex-1 min-h-0 flex flex-col overflow-y-auto p-1 pr-2 custom-scrollbar">
              {activeTab === "upload" && (
                <div className="flex-1 flex flex-col min-h-0 mb-6">
                  <div
                    ref={dropZoneRef}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative flex-1 flex flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed cursor-pointer transition-all duration-200 select-none ${
                      isDragging
                        ? "border-primary bg-primary/10 ring-4 ring-primary/5"
                        : "border-slate-200 bg-slate-50 hover:border-primary/50 hover:bg-primary/5"
                    }`}
                  >
                    {signatureUrl ? (
                      <div className="flex flex-col items-center gap-3 p-4">
                        {}
                        <img
                          src={signatureUrl}
                          alt="Assinatura atual"
                          className="max-h-40 max-w-full object-contain drop-shadow-sm"
                        />
                        <p className="text-xs font-medium text-primary hover:underline">
                          Trocar imagem
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <Upload className="h-7 w-7 text-primary" />
                        </div>
                        <div className="text-center px-4">
                          <p className="text-sm font-medium text-slate-700">
                            Clique ou arraste uma imagem
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-1.5">
                            Formatos aceitos: PNG (com fundo transparente
                            recomendado).
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                </div>
              )}

              {activeTab === "draw" && (
                <div className="flex-1 flex flex-col min-h-0 space-y-4 mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex-1 w-full max-w-full min-w-0 overflow-hidden rounded-md bg-white border border-slate-200 flex flex-col items-stretch shadow-inner relative group">
                    <div className="relative flex-1 min-h-[300px] w-full max-w-full">
                      <SignaturePad
                        ref={padRef}
                        strokeWidth={2.5}
                        className="h-full w-full border-0"
                      />
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
                    <Button
                      type="button"
                      className="flex-1 h-11"
                      onClick={applyPadToSignature}
                    >
                      Usar assinatura
                    </Button>
                  </div>
                  <p className="shrink-0 text-[11px] text-center text-muted-foreground leading-relaxed px-4">
                    O secretário deve desenhar a assinatura no quadro acima.
                  </p>
                </div>
              )}

              {activeTab === "mobile" && (
                <div className="flex-1 flex flex-col min-h-0 space-y-6 mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex-1 flex flex-col items-center justify-center gap-8 py-4">
                    {sessionToken ? (
                      <>
                        <div className="p-0">
                          <QRCodeSVG
                            value={`${getPublicAppBaseUrl()}/sign/${sessionToken}`}
                            size={280}
                            level="M"
                            includeMargin={false}
                          />
                        </div>
                        <div className="flex gap-3 w-full px-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-2 h-10 text-[11px]"
                            onClick={() => void copyMobileLink()}
                          >
                            <Copy className="h-3.5 w-3.5" />
                            Copiar link
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-2 h-10 text-[11px]"
                            onClick={() => void regenerateMobileSession()}
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                            Novo QR
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-muted-foreground text-sm py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span>Preparando link seguro…</span>
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-center text-muted-foreground leading-relaxed px-4">
                    Escaneie o QR Code com seu celular para assinar usando a
                    tela touch ou caneta stylus. Esse link expira em 15 minutos.
                  </p>
                </div>
              )}
            </div>

            <div className="shrink-0 pt-6 border-t border-slate-100 flex flex-col gap-4">
              <Button
                size="lg"
                onClick={handleSave}
                disabled={isSaving || isLoading || !hasChanges}
                className="w-full font-semibold shadow-sm h-12"
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Salvando...
                  </span>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Salvar
                  </>
                )}
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={handleRemove}
                  disabled={!signatureUrl}
                  className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 h-10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  className="h-10"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
