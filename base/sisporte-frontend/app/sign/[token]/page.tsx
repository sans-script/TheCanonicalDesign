"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  SignaturePad,
  type SignaturePadHandle,
} from "@/components/SignaturePad";
import { Button } from "@/components/ui/Button";
import {
  fetchPublicSignatureSession,
  submitPublicSignatureSession,
} from "@/lib/signature-session-client";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Smartphone, RotateCw } from "lucide-react";

export default function SignMobilePage() {
  const params = useParams();
  const token = typeof params.token === "string" ? params.token : "";
  const padRef = useRef<SignaturePadHandle>(null);

  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const verifySession = useCallback(async () => {
    if (!token) {
      setSessionError("Link inválido.");
      setLoading(false);
      return;
    }
    try {
      const data = await fetchPublicSignatureSession(token);
      if (data.status === "completed") {
        setAlreadyDone(true);
      }
    } catch (e) {
      setSessionError(e instanceof Error ? e.message : "Sessão indisponível.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  const handleSubmit = async () => {
    if (!padRef.current || padRef.current.isEmpty()) {
      toast.error("Desenhe sua assinatura antes de enviar.");
      return;
    }
    setSubmitting(true);
    try {
      const dataUrl = padRef.current.toDataURL();
      await submitPublicSignatureSession(token, dataUrl);
      setAlreadyDone(true);
      toast.success("Assinatura enviada. Você pode fechar esta página.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao enviar.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-3 bg-slate-50 p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Carregando…</p>
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-2 bg-slate-50 p-6 text-center">
        <p className="text-base font-medium text-slate-800">
          Link não disponível
        </p>
        <p className="text-sm text-muted-foreground max-w-sm">{sessionError}</p>
      </div>
    );
  }

  if (alreadyDone) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 bg-slate-50 p-6 text-center">
        <CheckCircle2 className="h-14 w-14 text-emerald-600" />
        <div className="space-y-1">
          <p className="text-lg font-semibold text-slate-800">
            Assinatura registrada
          </p>
          <p className="text-sm text-muted-foreground max-w-sm">
            O computador que exibiu o QR code já pode usar esta imagem. Você
            pode fechar esta página.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-slate-50 relative">
      {}
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md p-8 text-center sm:hidden portrait:flex landscape:hidden animate-in fade-in duration-500">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 bg-primary/5 rounded-2xl rotate-12" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Smartphone className="w-10 h-10 text-primary/40" />
          </div>
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">
          Gire seu celular
        </h2>
        <p className="text-slate-500 text-xs leading-relaxed max-w-[220px]">
          Para assinar com melhor precisão, use o modo{" "}
          <span className="text-primary font-bold">paisagem</span>.
        </p>
      </div>

      <header className="shrink-0 border-b border-slate-200 bg-white px-4 py-3">
        <h1 className="text-base font-semibold text-slate-900">Assinatura</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Desenhe na área abaixo, alinhando à linha tracejada. Use o dedo ou uma
          caneta stylus. Esse é de uso único e expira em 15 minutos.
        </p>
      </header>

      <main className="grid min-h-0 flex-1 w-full grid-rows-[minmax(0,1fr)_auto] gap-3 overflow-hidden">
        <div className="relative flex flex-col items-stretch justify-center overflow-hidden bg-white border-y border-slate-200">
          <div className="relative w-full flex-1 min-h-0">
            <SignaturePad
              ref={padRef}
              width={undefined}
              height={undefined}
              strokeWidth={2.75}
              className="h-full w-full"
            />
            <div
              className="pointer-events-none absolute left-6 right-6 bottom-[28%] z-10 h-0.5 border-b-2 border-dashed border-slate-300"
              aria-hidden
            />
          </div>
        </div>

        <div className="shrink-0 flex flex-col gap-2 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="h-12 flex-1 sm:h-11"
            onClick={() => padRef.current?.clear()}
            disabled={submitting}
          >
            Limpar
          </Button>
          <Button
            type="button"
            className="h-12 flex-1 font-semibold sm:h-11"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enviando…
              </>
            ) : (
              "Enviar assinatura"
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
