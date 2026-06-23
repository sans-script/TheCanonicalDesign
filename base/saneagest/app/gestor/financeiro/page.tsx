"use client"

import Header from "@/components/Header"
import { Card } from "@/components/ui/Card"
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react"

export default function Financeiro() {
  const metricas = [
    {
      titulo: "Receita Mensal",
      valor: "R$ 135.000",
      variacao: "+12%",
      tipo: "positivo",
    },
    {
      titulo: "Custos Operacionais",
      valor: "R$ 78.000",
      variacao: "+5%",
      tipo: "negativo",
    },
    {
      titulo: "Margem de Lucro",
      valor: "42.2%",
      variacao: "+3%",
      tipo: "positivo",
    },
    {
      titulo: "Lucro Líquido",
      valor: "R$ 57.000",
      variacao: "+18%",
      tipo: "positivo",
    },
  ]

  return (
    <div className="flex flex-col h-screen">
      <Header title="Financeiro" showIcons={true} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-xl lg:text-2xl font-bold text-grey-900 mb-2">Dashboard Financeiro</h1>
          <p className="text-sm text-grey-600">Acompanhe a performance financeira das suas ETEs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricas.map((metrica, index) => (
            <Card key={index} className="p-6 border-grey-200 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-secondary-lighter rounded-xl">
                  <DollarSign className="w-6 h-6 text-secondary-main" />
                </div>
                {metrica.tipo === "positivo" ? (
                  <TrendingUp className="w-5 h-5 text-success-main" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-error-main" />
                )}
              </div>
              <div>
                <p className="text-3xl font-bold text-grey-900 mb-1">{metrica.valor}</p>
                <p className="text-sm text-grey-500 mb-2">{metrica.titulo}</p>
                <p
                  className={`text-xs font-medium ${
                    metrica.tipo === "positivo" ? "text-success-main" : "text-error-main"
                  }`}
                >
                  {metrica.variacao} vs mês anterior
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 border-grey-200 shadow-md">
            <h3 className="font-semibold text-grey-900 mb-4">Receita por ETE</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-grey-600">ETE Central Maranhão</span>
                <span className="font-medium text-success-main">R$ 45.000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-grey-600">ETE Norte Industrial</span>
                <span className="font-medium text-success-main">R$ 72.000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-grey-600">ETE Sul Residencial</span>
                <span className="font-medium text-success-main">R$ 18.000</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-grey-200 shadow-md">
            <h3 className="font-semibold text-grey-900 mb-4">Distribuição de Custos</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-grey-600">Pessoal</span>
                <span className="font-medium text-grey-900">R$ 35.000 (45%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-grey-600">Energia</span>
                <span className="font-medium text-grey-900">R$ 23.000 (29%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-grey-600">Manutenção</span>
                <span className="font-medium text-grey-900">R$ 12.000 (15%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-grey-600">Outros</span>
                <span className="font-medium text-grey-900">R$ 8.000 (11%)</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
