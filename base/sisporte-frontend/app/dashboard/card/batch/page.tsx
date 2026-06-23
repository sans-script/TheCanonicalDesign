"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const loadingFallback = (
  <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] space-y-4">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    <p className="text-slate-500 font-medium animate-pulse">
      Carregando motor de impressão...
    </p>
  </div>
);

const BatchPrintContent = dynamic(
  () => import("./BatchPrintContent"),
  {
    ssr: false,
    loading: () => loadingFallback,
  }
);

export default function BatchPrintPage() {
  return (
    <Suspense fallback={loadingFallback}>
      <BatchPrintContent />
    </Suspense>
  );
}
