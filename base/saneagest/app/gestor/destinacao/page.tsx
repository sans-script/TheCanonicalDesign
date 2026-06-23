"use client"

import Header from "@/components/Header"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Truck, MapPin, Calendar, Package } from "lucide-react"

export default function DestinacaoLodo() {
  const entregas = [
    {
      id: "1",
      destino: "Fazenda Santa Luzia",
      endereco: "Rua dos Bobos, 0 - São Luís/MA",
      volume: "5.000 L",
      dataEntrega: "20/01/2024",
      status: "Agendada",
      motorista: "João Silva",
    },
    {
      id: "2",
      destino: "Sítio Boa Esperança",
      endereco: "Estrada do Campo, 123 - São Luís/MA",
      volume: "8.000 L",
      dataEntrega: "22/01/2024",
      status: "Em Trânsito",
      motorista: "Maria Santos",
    },
  ]

  return (
    <div className="flex flex-col h-screen">
      <Header title="Destinação do Lodo" showIcons={true} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl lg:text-2xl font-bold text-grey-900 truncate">Controle de Destinação</h1>
            <p className="text-sm text-grey-600 mt-1">Gerencie entregas e logística do lodo tratado</p>
          </div>
          <Button className="bg-secondary-main hover:bg-secondary-dark text-white px-4 py-2 rounded-xl">
            <Truck className="w-4 h-4 mr-2" />
            Agendar Entrega
          </Button>
        </div>

        <div className="space-y-4">
          {entregas.map((entrega) => (
            <Card key={entrega.id} className="p-6 border-grey-200 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-grey-900 text-lg">{entrega.destino}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    entrega.status === "Agendada"
                      ? "bg-warning-lighter text-warning-dark"
                      : entrega.status === "Em Trânsito"
                        ? "bg-info-lighter text-info-dark"
                        : "bg-success-lighter text-success-dark"
                  }`}
                >
                  {entrega.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-grey-500" />
                  <div>
                    <span className="text-xs text-grey-500 block">Endereço</span>
                    <span className="text-sm font-medium text-grey-900">{entrega.endereco}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-grey-500" />
                  <div>
                    <span className="text-xs text-grey-500 block">Volume</span>
                    <span className="text-sm font-medium text-grey-900">{entrega.volume}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-grey-500" />
                  <div>
                    <span className="text-xs text-grey-500 block">Data Entrega</span>
                    <span className="text-sm font-medium text-grey-900">{entrega.dataEntrega}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-grey-500" />
                  <div>
                    <span className="text-xs text-grey-500 block">Motorista</span>
                    <span className="text-sm font-medium text-grey-900">{entrega.motorista}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-grey-200">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  Ver Detalhes
                </Button>
                <Button size="sm" className="flex-1 bg-secondary-main hover:bg-secondary-dark text-white">
                  Rastrear
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
