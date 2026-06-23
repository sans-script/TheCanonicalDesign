"use client"

import Header from "@/components/Header"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { FileText, Download, Calendar } from "lucide-react"

export default function Relatorios() {
  return (
    <div className="flex flex-col h-screen bg-grey-200">
      <Header title="Relatórios" showIcons={true} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-xl lg:text-2xl font-bold text-grey-900 mb-2">Relatórios Gerenciais</h1>
          <p className="text-sm text-grey-600">Gere relatórios detalhados sobre suas operações</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 border-grey-200 shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-secondary-lighter rounded-lg flex-shrink-0">
                <FileText className="w-6 h-6 text-secondary-main" />
              </div>
              <h3 className="font-semibold text-grey-900">Relatório de Produção</h3>
            </div>
            <p className="text-sm text-grey-600 mb-6 flex-1">Dados detalhados sobre produção de lodo por ETE</p>
            <Button className="w-full bg-secondary-main hover:bg-secondary-dark text-white">
              <Download className="w-4 h-4 mr-2" />
              Gerar Relatório
            </Button>
          </Card>

          <Card className="p-6 border-grey-200 shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-success-lighter rounded-lg flex-shrink-0">
                <Calendar className="w-6 h-6 text-success-main" />
              </div>
              <h3 className="font-semibold text-grey-900">Relatório Financeiro</h3>
            </div>
            <p className="text-sm text-grey-600 mb-6 flex-1">Receitas, custos e margem de lucro por período</p>
            <Button className="w-full bg-success-main hover:bg-success-dark text-white">
              <Download className="w-4 h-4 mr-2" />
              Gerar Relatório
            </Button>
          </Card>

          <Card className="p-6 border-grey-200 shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-info-lighter rounded-lg flex-shrink-0">
                <FileText className="w-6 h-6 text-info-main" />
              </div>
              <h3 className="font-semibold text-grey-900">Relatório de Clientes</h3>
            </div>
            <p className="text-sm text-grey-600 mb-6 flex-1">Análise de produtores rurais e solicitações</p>
            <Button className="w-full bg-info-main hover:bg-info-dark text-white">
              <Download className="w-4 h-4 mr-2" />
              Gerar Relatório
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
