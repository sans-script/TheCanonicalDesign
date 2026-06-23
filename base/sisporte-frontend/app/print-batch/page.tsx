"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ServiceIdentityCard } from "@/components/ServiceIdentityCard";
import api from "@/lib/api";

function PrintBatchContent() {
  const searchParams = useSearchParams();
  const [guards, setGuards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [signature, setSignature] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const idsParam = searchParams.get("ids");
    const token = searchParams.get("token");

    if (!idsParam) {
      setError("Nenhum ID de guarda fornecido.");
      setLoading(false);
      return;
    }

    const ids = idsParam.split(",");

    if (token) {
      localStorage.setItem("token", token);
    }

    async function fetchData() {
      try {
        const [guardsRes, configRes] = await Promise.all([
          api.post("/guards/batch-data", { ids }),
          api.get("/settings/signature"),
        ]);

        const fetchedGuards = guardsRes.data;
        const sortedGuards = ids
          .map((id) => fetchedGuards.find((g: any) => g.id === id))
          .filter(Boolean);

        setGuards(sortedGuards);
        setSignature(configRes.data);
      } catch (err: any) {
        console.error("Error fetching data for printing:", err);
        setError(
          `Erro ao carregar dados: ${err.response?.data?.message || err.message}`,
        );
      } finally {
        setLoading(false);
        setTimeout(() => {
          (window as any).isReadyForPrint = true;
        }, 1000);
      }
    }

    fetchData();
  }, [searchParams]);

  if (loading)
    return (
      <div className="p-8 text-center font-sans">
        Carregando dados para impressão...
      </div>
    );

  if (error)
    return (
      <div className="p-8 text-red-600 text-center font-sans font-bold">
        {error}
      </div>
    );

  return (
    <div className="bg-white min-h-screen p-0 m-0 overflow-visible">
      <style jsx global>{`
        @page {
          size: A4;
          margin: 0;
        }
        html,
        html,
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          width: 100%;
          height: 100%;
          -webkit-print-color-adjust: exact;
        }
        .batch-print-mode .card-container {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          justify-content: flex-start !important;
          gap: 0 !important;
          width: 172mm !important;
          height: 54.2mm !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
        }
        .print-grid {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          width: 172mm;
          height: 297mm !important;
          min-height: 297mm !important;
          margin: 0 auto !important;
          justify-content: flex-start !important;
          box-sizing: border-box;
          padding: 3mm 0;
          gap: 2.5mm;
          page-break-after: always;
          background: white;
        }
        @media screen {
          .print-grid {
            margin-bottom: 20px !important;
            transform-origin: top center;
          }

          @media (max-width: 800px) {
            .print-grid {
              transform: none !important;
            }
          }

          @media (max-width: 500px) {
            .print-grid {
              transform: scale(0.45);
              margin-top: -200px;
              margin-bottom: -200px !important;
            }
          }
        }
        .print-grid > * {
          margin: 0 !important;
          padding: 0 !important;
          border: none !important;
          break-inside: avoid;
          page-break-inside: avoid;
        }
      `}</style>

      <div className="print-layout-root">
        {Array.from({ length: Math.ceil(guards.length / 5) }).map(
          (_, pageIndex, arr) => (
            <div
              key={`page-${pageIndex}`}
              className="print-grid"
              style={{
                breakAfter: pageIndex < arr.length - 1 ? "page" : "auto",
                pageBreakAfter: pageIndex < arr.length - 1 ? "always" : "auto",
              }}
            >
              {guards.slice(pageIndex * 5, (pageIndex + 1) * 5).map((guard) => {
                const backendUrl =
                  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
                  (typeof window !== "undefined"
                    ? `${window.location.protocol}//${window.location.hostname}:3001`
                    : "");
                const fullSignatureUrl = signature?.signatureUrl
                  ? signature.signatureUrl.startsWith("http")
                    ? signature.signatureUrl
                    : `${backendUrl}${signature.signatureUrl}`
                  : null;

                return (
                  <ServiceIdentityCard
                    key={guard.id}
                    data={{
                      ...guard,
                      qrCodeUrl: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/validate/${guard.token}`,
                      signatureUrl: fullSignatureUrl,
                      signatureX: signature?.x,
                      signatureY: signature?.y,
                      signatureScale: signature?.scale,
                    }}
                    printLayout="batch"
                  />
                );
              })}
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export default function PrintBatchPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center font-sans">Inicializando...</div>
      }
    >
      <PrintBatchContent />
    </Suspense>
  );
}
