"use client"

import { Eye, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface CardDocumentoProps {
  title: string
  type: string
  size: string
  date: string
  status: "Válido" | "Pendente"
  onView: () => void
  onDownload: () => void
}

export default function CardDocumento({ title, type, size, date, status, onView, onDownload }: CardDocumentoProps) {
  const statusConfig = {
    Válido: {
      bg: "bg-success-lighter",
      text: "text-success-dark",
      label: "Válido",
    },
    Pendente: {
      bg: "bg-warning-lighter",
      text: "text-warning-dark",
      label: "Pendente",
    },
  }

  const statusStyle = statusConfig[status]

  return (
    <div className="bg-white rounded-xl shadow-md border border-grey-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-2 bg-grey-100 rounded-lg">
            <FileText className="h-6 w-6 text-grey-600" />
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-grey-900 mb-2">{title}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-grey-500">
              <span>
                Tipo: <span className="font-medium text-grey-700">{type}</span>
              </span>
              <span>
                Tamanho: <span className="font-medium text-grey-700">{size}</span>
              </span>
              <span>
                Data: <span className="font-medium text-grey-700">{date}</span>
              </span>
              <div className="flex items-center gap-2">
                <span>Status:</span>
                <span className={`${statusStyle.bg} ${statusStyle.text} px-2 py-1 rounded-full text-xs font-medium`}>
                  {statusStyle.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onView}
            className="border-grey-300 text-grey-700 hover:bg-grey-50 bg-transparent"
          >
            <Eye className="w-4 h-4 mr-2" />
            Visualizar
          </Button>
          <Button onClick={onDownload} className="bg-primary-main hover:bg-primary-dark text-white" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </div>
  )
}
