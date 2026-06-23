"use client"

import Header from "@/components/Header"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Shield, FileText, AlertTriangle, CheckCircle } from "lucide-react"

export default function DocumentosGestor() {
  const documentos = [
    {
      titulo: "Licença Ambiental - ETE Central",
      tipo: "Licença de Operação",
      validade: "15/12/2024",
      status: "Válida",
      ete: "ETE Central Maranhão",
    },
    {
      titulo: "Certificado de Qualidade - Lodo Classe A",
      tipo: "Certificação",
      validade: "30/06/2024",
      status: "Válida",
      ete: "ETE Norte Industrial",
    },
    {
      titulo: "Licença Ambiental - ETE Sul",
      tipo: "Licença de Operação",
      validade: "10/01/2024",
      status: "Vencida",
      ete: "ETE Sul Residencial",
    },
  ]

  return (
    <div className="flex flex-col h-screen">
      <Header title="Licenças e Certificados" showIcons={true} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-xl lg:text-2xl font-bold text-grey-900 mb-2">Documentos e Licenças</h1>
          <p className="text-sm text-grey-600">Gerencie licenças e certificações das suas ETEs</p>
        </div>

        <div className="space-y-4">
          {documentos.map((doc, index) => (
            <Card key={index} className="p-6 border-grey-200 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary-lighter rounded-lg">
                    <Shield className="w-6 h-6 text-secondary-main" />
                  </div>
                  <div>
                    <h3 className="font-bold text-grey-900">{doc.titulo}</h3>
                    <p className="text-sm text-grey-600">{doc.ete}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.status === "Válida" ? (
                    <CheckCircle className="w-5 h-5 text-success-main" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-error-main" />
                  )}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      doc.status === "Válida"
                        ? "bg-success-lighter text-success-dark"
                        : "bg-error-lighter text-error-dark"
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <span className="text-xs text-grey-500 block">Tipo</span>
                  <span className="text-sm font-medium text-grey-900">{doc.tipo}</span>
                </div>
                <div>
                  <span className="text-xs text-grey-500 block">Validade</span>
                  <span className="text-sm font-medium text-grey-900">{doc.validade}</span>
                </div>
                <div>
                  <span className="text-xs text-grey-500 block">ETE</span>
                  <span className="text-sm font-medium text-grey-900">{doc.ete}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-grey-200">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <FileText className="w-4 h-4 mr-2" />
                  Visualizar
                </Button>
                <Button size="sm" className="flex-1 bg-secondary-main hover:bg-secondary-dark text-white">
                  {doc.status === "Vencida" ? "Renovar" : "Download"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
