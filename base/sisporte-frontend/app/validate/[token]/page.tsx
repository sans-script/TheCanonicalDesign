"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { publicService } from "@/services/public.service";
import { XCircle, Shield } from "lucide-react";
import { settingsService } from "@/services/settings.service";
import type { Guard, SignatureConfig } from "@/lib/types";
import { ServiceIdentityCard } from "@/components/ServiceIdentityCard";
import { cn } from "@/lib/utils";

export default function ValidatePage() {
  const { token } = useParams();
  const [guard, setGuard] = useState<Guard | null>(null);
  const [signatureConfig, setSignatureConfig] =
    useState<SignatureConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [cardScale, setCardScale] = useState(1);

  useEffect(() => {
    const el = cardContainerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const available = entry.contentRect.width;
      const scale = Math.min(available / 540, 1);
      setCardScale(scale);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [isLoading, error, guard, signatureConfig]);

  useEffect(() => {
    async function validate() {
      if (!token) return;
      try {
        const [data, signature] = await Promise.all([
          publicService.validateToken(token as string),
          settingsService.getPublicSignature().catch(() => null),
        ]);
        setGuard(data);
        setSignatureConfig(signature);
      } catch (err) {
        console.error("Validation failed", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    validate();
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="relative w-16 h-16 mb-8">
          <div className="absolute inset-0 border-[5px] border-slate-100 rounded-full"></div>
          <div className="absolute inset-0 border-[5px] border-[#1e3a5f] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-[#1e3a5f] font-black text-sm tracking-widest uppercase">
            CARTEIRA FUNCIONAL DIGITAL
          </h3>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse">
            Validando Autenticidade do Documento...
          </p>
        </div>
      </div>
    );
  }

  if (error || !guard) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] flex flex-col">
        <header className="bg-[#1e3a5f] text-white py-4">
          <div className="container mx-auto px-4 flex items-center gap-4">
            <Image
              src="/brasaoguarda.png"
              alt="Brasão da Guarda Municipal"
              width={48}
              height={48}
              className="w-12 h-auto"
              style={{ height: "auto" }}
            />
            <div>
              <h1 className="font-bold uppercase">
                Guarda Municipal de São Luís
              </h1>
              <p className="text-sm text-slate-400">
                Sistema de Validação de Carteira Funcional
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Carteira Inválida
            </h2>
            <p className="text-[#4a5a7a] mb-6">
              O código de validação informado não corresponde a nenhuma carteira
              funcional registrada no sistema.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
              <p className="text-sm text-red-700">
                <strong>Atenção:</strong> Se você escaneou este QR Code de um
                documento físico, ele pode ser uma falsificação. Entre em
                contato com a Guarda Municipal de São Luís para verificação.
              </p>
            </div>
          </div>
        </main>

        <footer className="bg-[#1e3a5f] text-white/70 py-4 text-center text-sm">
          <p>Guarda Municipal de São Luís - MA</p>
          <p>Secretaria Municipal de Segurança com Cidadania</p>
        </footer>
      </div>
    );
  }

  const isActive = guard.status === "active";

  return (
    <div className="h-screen bg-[#f8fafc] flex flex-col font-sans overflow-hidden">
      <header className="bg-[#1e3a5f] text-white py-4 shadow-lg shrink-0">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <Image
            src="/brasaoguarda.png"
            alt="Brasão da Guarda Municipal"
            width={44}
            height={44}
            className="w-11 h-auto"
            style={{ height: "auto" }}
          />
          <div>
            <h1 className="font-bold text-sm tracking-tight uppercase">
              Guarda Municipal de São Luís
            </h1>
            <p className="text-[10px] text-slate-300 uppercase tracking-widest">
              Validador de Identidade Funcional
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8 flex flex-col items-center">
          <div
            ref={cardContainerRef}
            className="w-full max-w-[540px] flex justify-center flex-col items-center"
          >
            <ServiceIdentityCard
              data={{
                ...guard,
                filiation: {
                  fatherName: guard.fatherName || "",
                  motherName: guard.motherName || "",
                },
                qrCodeUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/validate/${guard.token}`,
                // Secretary (secretário) signature
                signatureUrl: signatureConfig?.signatureUrl ?? undefined,
                signatureX: signatureConfig?.x ?? 270,
                signatureY: signatureConfig?.y ?? 290,
                signatureScale: signatureConfig?.scale ?? 1.0,
                // Guard (servidor) signature — guard.signatureUrl is overridden above, so map explicitly
                serverSignatureUrl: guard.signatureUrl ?? undefined,
                serverSignatureX: guard.signatureX ?? undefined,
                serverSignatureY: guard.signatureY ?? undefined,
                serverSignatureScale: guard.signatureScale ?? undefined,
              }}
              scale={cardScale}
              screenLayout="column"
              isPublic={true}
            />
          </div>

          {}
          <div className="mt-8 w-full max-w-[540px] space-y-6">
            {}
            <div className="bg-white rounded-md shadow-md border border-slate-100 overflow-hidden text-left">
              <div className="bg-[#1e3a5f] px-6 py-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-white" />
                <p className="text-sm font-black text-white uppercase tracking-wider">
                  Status e Autorizações
                </p>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
                {}
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Vínculo
                  </p>
                  <p
                    className={cn(
                      "text-sm font-bold flex items-center gap-2",
                      isActive ? "text-emerald-600" : "text-rose-600",
                    )}
                  >
                    <span
                      className={cn(
                        "w-2.5 h-2.5 rounded-full",
                        isActive ? "bg-emerald-600" : "bg-rose-600",
                      )}
                    />
                    {guard.status === "active" ? "Ativo" : "Inativo"}
                  </p>
                </div>

                {}
                <div className="flex flex-col gap-1 sm:border-l sm:border-slate-100 sm:pl-8">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Porte de Arma
                  </p>
                  <p
                    className={cn(
                      "text-sm font-bold flex items-center gap-2",
                      guard.weaponCarryStatus === "active"
                        ? "text-emerald-600"
                        : guard.weaponCarryStatus === "expired"
                          ? "text-amber-600"
                          : "text-rose-600",
                    )}
                  >
                    <span
                      className={cn(
                        "w-2.5 h-2.5 rounded-full",
                        guard.weaponCarryStatus === "active"
                          ? "bg-emerald-600"
                          : guard.weaponCarryStatus === "expired"
                            ? "bg-amber-600"
                            : "bg-rose-600",
                      )}
                    />
                    {guard.weaponCarryStatus === "active"
                      ? "Ativo"
                      : guard.weaponCarryStatus === "inactive"
                        ? "Inativo"
                        : guard.weaponCarryStatus === "expired"
                          ? "Expirado"
                          : guard.weaponCarryStatus === "revoked"
                            ? "Revogado"
                            : guard.weaponCarryStatus === "suspended"
                              ? "Suspenso"
                              : guard.weaponCarryStatus}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-md p-6 shadow-md border border-slate-100">
              <div className="flex items-start gap-4">
                <div className="space-y-2 w-full text-center lg:text-left">
                  <p className="text-[13px] text-slate-600 leading-relaxed italic">
                    Este registro digital é a representação oficial dos dados do
                    servidor contidos na base de dados da SEMUSC.
                  </p>
                  <p className="text-[13px] text-slate-500 font-bold leading-relaxed">
                    Validado em {new Date().toLocaleDateString("pt-BR")} às{" "}
                    {new Date().toLocaleTimeString("pt-BR")}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-100 text-slate-500 py-8 text-center border-t">
        <div className="container mx-auto px-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">
            Guarda Municipal de São Luís - MA
          </p>
          <p className="text-xs text-slate-400">
            Secretaria Municipal de Segurança com Cidadania
          </p>
          <div className="mt-4 pt-4 border-t border-slate-200 inline-block px-8 text-[9px] text-slate-400 italic">
            Documento gerado digitalmente pelo sistema SISPORTE v1.3.0
          </div>
        </div>
      </footer>
    </div>
  );
}
