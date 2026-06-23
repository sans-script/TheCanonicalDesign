'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ServiceIdentityCard } from '@/components/ServiceIdentityCard';
import api from '@/lib/api';

export default function PrintBatchPage() {
  const searchParams = useSearchParams();
  const [guards, setGuards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [signature, setSignature] = useState<any>(null);

  useEffect(() => {
    const ids = searchParams.get('ids')?.split(',') || [];
    const token = searchParams.get('token');

    if (ids.length === 0) return;

    if (token) {
      localStorage.setItem('token', token);
    }

    async function fetchData() {
      try {
        const [guardsRes, configRes] = await Promise.all([
          api.post('/guards/batch-data', { ids }),
          api.get('/settings/signature')
        ]);
        
        setGuards(guardsRes.data);
        setSignature(configRes.data);
        
      } catch (err) {

        console.error('Error fetching data for printing:', err);

      } finally {
        setLoading(false);

        (window as any).isReadyForPrint = true;
      }
    }

    fetchData();
  }, [searchParams]);

  if (loading) return <div className="p-8">Carregando dados para impressão...</div>;

  return (
    <div className="bg-white min-h-screen p-0 m-0">
      <style jsx global>{`
        @page {
          size: A4;
          margin: 0;
        }
        body {
          margin: 0;
          padding: 0;
          background: white;
        }
        .print-grid {
          display: grid;
          grid-template-columns: minmax(0, 172mm);
          row-gap: 1.5mm;
          column-gap: 0;
          width: max-content;
          max-width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
          padding: 6mm 2mm;
          justify-content: center;
          align-content: start;
          -webkit-box-decoration-break: clone;
          box-decoration-break: clone;
        }
        .print-grid > * {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        .card-slot {
          width: 100%;
          min-width: 0;
          overflow: visible;
        }
      `}</style>
      
      <div className="print-grid">
        {guards.map((guard) => (
          <div key={guard.id} className="card-slot">
            <ServiceIdentityCard 
              data={{
                ...guard,
                qrCodeUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/validate/${guard.token}`,
                signatureUrl: signature?.signatureUrl,
                signatureX: signature?.x,
                signatureY: signature?.y,
                signatureScale: signature?.scale,
                serverSignatureUrl: guard.signatureUrl,
                serverSignatureX: guard.signatureX,
                serverSignatureY: guard.signatureY,
                serverSignatureScale: guard.signatureScale,
              }}
              printLayout="batch"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
