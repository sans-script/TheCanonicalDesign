"use client";

import { usePathname } from "next/navigation";
import { Monitor, Smartphone } from "lucide-react";

export default function MobileOverlay() {
  const pathname = usePathname();
  
  if (pathname?.startsWith("/sign/")) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white p-8 text-center lg:hidden animate-in fade-in duration-500">
      <div className="relative w-24 h-24 mb-10">
        <div className="absolute inset-0 bg-primary/5 rounded-3xl rotate-12 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Monitor className="w-12 h-12 text-primary" />
          <Smartphone className="absolute -bottom-1 -right-1 w-6 h-6 text-slate-400 bg-white rounded-md p-1 shadow-sm" />
        </div>
      </div>      
      <p className="text-slate-600 text-sm leading-relaxed max-w-[300px] mb-8">
        A experiência em dispositivos móveis é <span className="text-rose-500 font-bold">prejudicada</span> nesta plataforma. Para uma melhor usabilidade e precisão, recomendamos o uso de <span className="text-primary font-bold">telas maiores</span>.
      </p>
      
      <div className="flex flex-col gap-3 w-full max-w-[240px]">
        <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
            <Monitor className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Recomendado</p>
            <p className="text-xs font-bold text-slate-700">Computador / Notebook</p>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 flex items-center gap-2">
        <div className="w-1 h-1 rounded-full bg-slate-300" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">SISPORTE</span>
        <div className="w-1 h-1 rounded-full bg-slate-300" />
      </div>
    </div>
  );
}
