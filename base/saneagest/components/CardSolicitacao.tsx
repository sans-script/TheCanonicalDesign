"use client"

import { Eye } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface CardSolicitacaoProps {
  code: string
  origin: string
  property: string
  volume: string
  date: string
  status: string
  onViewDetails?: () => void
}

const campos = [
  { label: "ETE Origem", key: "origin" },
  { label: "Propriedade", key: "property" },
  { label: "Volume Solicitado", key: "volume" },
  { label: "Data da Solicitação", key: "date" },
  { label: "Status", key: "status" },
]

export default function CardSolicitacao({
  code,
  origin,
  property,
  volume,
  date,
  status,
  onViewDetails,
}: CardSolicitacaoProps) {
  const data = { code, origin, property, volume, date, status }

  return (
    <div className="bg-white rounded-xl shadow-md border border-grey-200 p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-bold text-grey-900 mb-6">{code}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {campos.map((campo) => (
          <div key={campo.key}>
            <p className="text-xs font-semibold text-grey-500 mb-1 uppercase tracking-wide">{campo.label}</p>
            <p className="text-sm font-medium text-grey-900">{(data as any)[campo.key]}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onViewDetails}
          className="bg-primary-main hover:bg-primary-dark text-white px-4 py-2 rounded-xl transition-colors"
        >
          <Eye className="w-4 h-4 mr-2" />
          Ver Detalhes
        </Button>
      </div>
    </div>
  )
}
