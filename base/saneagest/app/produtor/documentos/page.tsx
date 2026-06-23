"use client"

import CardDocumento from "@/components/CardDocumento"
import Header from "@/components/Header"
import { mockDocumentos } from "@/data/mockDocumentos"

export default function Documentos() {
  const handleView = (title: string) => {
    // TODO: Implementar visualização do documento
    console.log(`Visualizar: ${title}`)
  }

  const handleDownload = (title: string) => {
    // TODO: Implementar download do documento
    console.log(`Download: ${title}`)
  }

  return (
    <div className="flex flex-col h-screen bg-grey-200">
      <Header title="Documentos e Licenças" showIcons={true} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {mockDocumentos.map((doc, index) => (
            <CardDocumento
              key={index}
              {...doc}
              onView={() => handleView(doc.title)}
              onDownload={() => handleDownload(doc.title)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
