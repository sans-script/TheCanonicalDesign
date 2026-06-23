"use client"

import Header from "@/components/Header"
import { Card } from "@/components/ui/Card"
import { BarChart3, TrendingUp, Droplets, Factory } from "lucide-react"

export default function ControleProducao() {
  const metricas = [
    {
      titulo: "Produção Hoje",
      valor: "125.000 L",
      variacao: "+8%",
      cor: "bg-secondary-main",
    },
    {
      titulo: "Capacidade Utilizada",
      valor: "78%",
      variacao: "+5%",
      cor: "bg-info-main",
    },
    {
      titulo: "Eficiência",
      valor: "94%",
      variacao: "+2%",
      cor: "bg-success-main",
    },
    {
      titulo: "Tempo Médio Ciclo",
      valor: "18h",
      variacao: "-3%",
      cor: "bg-warning-main",
    },
  ]

  return (
    <div className="flex flex-col h-screen">
      <Header title="Controle de Produção" showIcons={true} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-xl lg:text-2xl font-bold text-grey-900 mb-2">Monitoramento da Produção</h1>
          <p className="text-sm text-grey-600">Acompanhe métricas em tempo real das suas ETEs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricas.map((metrica, index) => (
            <Card key={index} className="p-6 border-grey-200 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${metrica.cor} rounded-xl flex items-center justify-center`}>
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-success-main" />
              </div>
              <div>
                <p className="text-3xl font-bold text-grey-900 mb-1">{metrica.valor}</p>
                <p className="text-sm text-grey-500 mb-2">{metrica.titulo}</p>
                <p className="text-xs text-success-main font-medium">{metrica.variacao} vs ontem</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 border-grey-200 shadow-md">
            <h3 className="font-semibold text-grey-900 mb-4">Produção por ETE</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-grey-600">ETE Central Maranhão</span>
                <span className="font-medium text-grey-900">42.500 L</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-grey-600">ETE Norte Industrial</span>
                <span className="font-medium text-grey-900">69.000 L</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-grey-600">ETE Sul Residencial</span>
                <span className="font-medium text-grey-900">13.500 L</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-grey-200 shadow-md">
            <h3 className="font-semibold text-grey-900 mb-4">Alertas Operacionais</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-warning-lighter rounded-lg">
                <Factory className="w-5 h-5 text-warning-main" />
                <div>
                  <p className="text-sm font-medium text-warning-dark">Manutenção Programada</p>
                  <p className="text-xs text-warning-dark">ETE Sul - 5 dias</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-info-lighter rounded-lg">
                <Droplets className="w-5 h-5 text-info-main" />
                <div>
                  <p className="text-sm font-medium text-info-dark">Capacidade Alta</p>
                  <p className="text-xs text-info-dark">ETE Norte - 92%</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
