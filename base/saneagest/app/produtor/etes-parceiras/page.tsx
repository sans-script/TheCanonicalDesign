"use client"

import React from "react"
import Header from "@/components/Header"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Mail, Phone, Star, MapPin, Droplets, Factory, Search } from "lucide-react"
import { etesMock, statusOptions, statusColors, type ETE } from "@/data/mockEtes"

function CardEte({ ete }: { ete: ETE }) {
  const getStatusColor = (status: string) => {
    return statusColors[status] || "bg-grey-100 text-grey-600"
  }

  const isDisabled = ete.status !== "Ativa"

  return (
    <Card className="p-6 border-grey-200 hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      <div className="flex-1">
        {/* Header com nome e status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-transparent-8 rounded-lg">
              <Factory className="w-6 h-6 text-primary-main" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-grey-900 text-lg truncate">{ete.nome}</h3>
              <p className="text-sm text-grey-600 truncate">{ete.empresa}</p>
            </div>
          </div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(
              ete.status,
            )}`}
          >
            {ete.status}
          </span>
        </div>

        {/* Informações principais */}
        <div className="space-y-3 text-sm mb-4">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-grey-500 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-grey-600 block">{ete.endereco}</span>
              <span className="text-grey-500 text-xs">Distância: {ete.distancia}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-grey-500 flex-shrink-0" />
            <span className="text-grey-600">Capacidade: {ete.capacidade}</span>
          </div>

          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-warning-main flex-shrink-0" />
            <span className="text-grey-600">
              {ete.avaliacao}/5.0 ({ete.avaliacoes} avaliações)
            </span>
          </div>
        </div>

        {/* Contato */}
        <div className="pt-3 border-t border-grey-200 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-grey-500 flex-shrink-0" />
            <span className="text-grey-600">{ete.telefone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-grey-500 flex-shrink-0" />
            <span className="text-grey-600 truncate">{ete.email}</span>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="flex gap-3 pt-4 mt-auto">
        <Button
          variant="outline"
          size="sm"
          disabled={isDisabled}
          className="flex-1 border-grey-300 text-grey-700 hover:bg-grey-50 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Ver Lotes
        </Button>
        <Button
          size="sm"
          disabled={isDisabled}
          className="flex-1 bg-primary-main hover:bg-primary-dark text-white disabled:bg-grey-300 disabled:text-grey-500 disabled:cursor-not-allowed"
        >
          {isDisabled ? "Indisponível" : "Solicitar Lodo"}
        </Button>
      </div>
    </Card>
  )
}

export default function EtesParceiras() {
  const [search, setSearch] = React.useState("")
  const [status, setStatus] = React.useState("Todos")

  // Filtrar por busca e status
  const etesFiltradas = etesMock.filter((ete) => {
    const matchesSearch =
      ete.nome.toLowerCase().includes(search.toLowerCase()) ||
      ete.empresa.toLowerCase().includes(search.toLowerCase()) ||
      ete.endereco.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = status === "Todos" || ete.status === status

    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col h-screen bg-grey-200">
      <Header title="ETEs Parceiras" searchValue={search} onSearch={setSearch} showIcons={true} />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Header da página */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl lg:text-2xl font-bold text-grey-900 truncate">ETEs Parceiras</h1>
          </div>
        </div>

        {/* Filtros de status */}
        <div className="flex flex-wrap gap-2 mb-6">
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-200 ${
                status === s
                  ? "bg-primary-main text-white border-primary-main"
                  : "bg-white text-grey-700 border-grey-300 hover:bg-grey-50 hover:border-grey-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Grid de ETEs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {etesFiltradas.map((ete) => (
            <CardEte key={ete.id} ete={ete} />
          ))}
        </div>

        {/* Estado vazio */}
        {etesFiltradas.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-grey-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-grey-400" />
            </div>
            <h3 className="text-lg font-semibold text-grey-900 mb-2">
              {search || status !== "Todos" ? "Nenhuma ETE encontrada" : "Nenhuma ETE disponível"}
            </h3>
            <p className="text-grey-600 max-w-md">
              {search || status !== "Todos"
                ? "Tente ajustar os filtros ou termos de busca."
                : "Não há estações de tratamento cadastradas no momento."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
