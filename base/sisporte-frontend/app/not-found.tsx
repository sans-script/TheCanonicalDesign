"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-[#050656] text-white py-4 shadow-md">
        <div className="container mx-auto px-6 flex items-center gap-4">
          <Image
            src="/brasaoguarda.png"
            alt="Brasão da Guarda Municipal"
            width={48}
            height={48}
            className="w-12 h-auto"
            style={{ height: "auto" }}
          />
          <div>
            <h1 className="font-bold text-sm tracking-widest uppercase">
              Guarda Municipal de São Luís
            </h1>
            <p className="text-[10px] text-slate-300 font-medium uppercase tracking-[0.2em]">
              Sistema de Identificação de Carteira Funcional
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-32 h-32 bg-slate-200 rounded-full flex items-center justify-center mb-8 shadow-inner">
          <SearchX className="w-16 h-16 text-slate-400" />
        </div>

        <div className="max-w-md space-y-3 mb-10">
          <h2 className="text-6xl font-black text-[#050656] tracking-tighter uppercase">
            Erro 404
          </h2>
          <p className="text-xl font-bold text-slate-800">
            Página não encontrada!
          </p>
          <p className="text-slate-500 text-base leading-relaxed">
            Parece que você se perdeu no patrulhamento. A rota que você tentou acessar não existe ou foi movida para outro setor.
          </p>
        </div>

        <div className="w-full max-w-xs mx-auto">
          <Link href="/">
            <Button
              size="lg"
              className="w-full font-bold uppercase tracking-widest shadow-lg shadow-primary/20 bg-gradient-to-r from-[#050656] to-[#3E4084] border-0"
            >
              <Home className="w-5 h-5 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200">
        SEMUSC — Secretaria Municipal de Segurança com Cidadania
      </footer>
    </div>
  );
}
