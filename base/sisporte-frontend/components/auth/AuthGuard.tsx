"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/services/auth.service";
import { Shield, Lock } from "lucide-react";
import { IoHandLeft } from "react-icons/io5";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isAuth = authService.isAuthenticated();
    setAuthorized(isAuth);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#050656] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-sm font-bold text-[#050656] tracking-[0.2em] uppercase opacity-50">
          Carregando...
        </p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="bg-[#050656] text-white py-4 shadow-md">
          <div className="container mx-auto px-6 flex items-center gap-6">
            <div className="shrink-0">
              <Image
                src="/brasaoguarda.png"
                alt="Brasão da Guarda Municipal"
                width={48}
                height={48}
                className="w-12 h-auto object-contain"
                style={{ height: "auto" }}
                priority
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="font-black text-lg tracking-wider uppercase leading-tight">
                Guarda Municipal de São Luís
              </h1>
              <p className="text-[11px] text-slate-300 font-bold uppercase tracking-[0.15em] mt-1 opacity-90">
                Sistema de Identificação de Carteira Funcional
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-32 h-32 bg-[#050656]/5 rounded-full flex items-center justify-center mb-8 shadow-inner relative">
            <Shield className="w-16 h-16 text-amber-500 fill-amber-500/10" />
            <div className="absolute top-12 -right-2 bg-white p-2 rounded-full shadow-md border border-slate-200">
              <IoHandLeft className="w-6 h-6 text-[#F00]" />
            </div>
          </div>

          <h2 className="text-4xl font-black text-[#050656] mb-4 tracking-tight uppercase">
            Parado aí, Servidor!
          </h2>

          <div className="max-w-2xl space-y-4">
            <p className="text-xl font-bold text-slate-800">
              Você não tem permissão para circular nesta área ou sua sessão
              expirou.
            </p>
            <p className="text-slate-500 text-base leading-relaxed">
              O acesso a este módulo é restrito a administradores autorizados do
              sistema. <br />
              Por motivos de segurança, se você ficou inativo por muito tempo,
              sua sessão foi encerrada automaticamente para proteger os dados do
              sistema.
              <br />
              <br />
              Voce deve se autenticar novamente para acessar o sistema.
            </p>
          </div>
          <div className="mt-12 w-full max-w-sm">
            <Button
              onClick={() => router.push("/")}
              size="lg"
              className="w-full font-semibold shadow-lg shadow-primary/20 transition-all active:scale-[0.98] uppercase tracking-wider"
            >
              REAUTENTICAR NO SISTEMA
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return <>{children}</>;
}

