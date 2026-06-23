"use client"

import React from "react"
import Header from "@/components/Header"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { User, MapPin, Calendar, Droplets, DollarSign, Check, X, Eye, Phone, Mail, Clock } from "lucide-react"
import { solicitacoesRecebidas } from "@/data/mockGestor"

export default function SolicitacoesRecebidas() {
  const [search, setSearch] = React.useState("")
  const [filtroStatus, setFiltroStatus] = React.useState("Todos")

  const statusOptions = ["Todos", "Pendente", "Em Análise", "Aprovada", "Rejeitada"]

  const solicitacoesFiltradas = solicitacoesRecebidas.filter((solicitacao) => {
    const matchesSearch =
      solicitacao.codigo.toLowerCase().includes(search.toLowerCase()) ||
      solicitacao.produtor.nome.toLowerCase().includes(search.toLowerCase()) ||
      solicitacao.produtor.propriedade.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = filtroStatus === "Todos" || solicitacao.status === filtroStatus

    return matchesSearch && matchesStatus
  })

  const handleAprovar = (id: string) => {
    console.log(`Aprovar solicitação: ${id}`)
  }

  const handleRejeitar = (id: string) => {
    console.log(`Rejeitar solicitação: ${id}`)
  }

  const handleVerDetalhes = (id: string) => {
    console.log(`Ver detalhes da solicitação: ${id}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovada":
        return "bg-success-lighter text-success-dark"
      case "Pendente":
        return "bg-warning-lighter text-warning-dark"
      case "Em Análise":
        return "bg-info-lighter text-info-dark"
      case "Rejeitada":
        return "bg-error-lighter text-error-dark"
      default:
        return "bg-grey-100 text-grey-600"
    }
  }

  const contarPorStatus = (status: string) => {
    return solicitacoesRecebidas.filter((s) => s.status === status).length
  }

  return (
    <div className="flex flex-col h-screen">
      <Header title="Solicitações Recebidas" searchValue={search} onSearch={setSearch} showIcons={true} />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Header da página */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl lg:text-2xl font-bold text-grey-900 truncate">Solicitações de Lodo</h1>
            <p className="text-sm text-grey-600 mt-1">Gerencie as solicitações recebidas dos produtores rurais</p>
          </div>
        </div>

        {/* Resumo por Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 border-grey-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning-lighter rounded-lg">
                <Clock className="w-5 h-5 text-warning-main" />
              </div>
              <div>
                <p className="text-2xl font-bold text-grey-900">{contarPorStatus("Pendente")}</p>
                <p className="text-sm text-grey-500">Pendentes</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-grey-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-info-lighter rounded-lg">
                <Eye className="w-5 h-5 text-info-main" />
              </div>
              <div>
                <p className="text-2xl font-bold text-grey-900">{contarPorStatus("Em Análise")}</p>
                <p className="text-sm text-grey-500">Em Análise</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-grey-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success-lighter rounded-lg">
                <Check className="w-5 h-5 text-success-main" />
              </div>
              <div>
                <p className="text-2xl font-bold text-grey-900">{contarPorStatus("Aprovada")}</p>
                <p className="text-sm text-grey-500">Aprovadas</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-grey-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-error-lighter rounded-lg">
                <X className="w-5 h-5 text-error-main" />
              </div>
              <div>
                <p className="text-2xl font-bold text-grey-900">{contarPorStatus("Rejeitada")}</p>
                <p className="text-sm text-grey-500">Rejeitadas</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filtros de Status */}
        <div className="flex flex-wrap gap-2 mb-6">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setFiltroStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-200 ${
                filtroStatus === status
                  ? "bg-secondary-main text-white border-secondary-main"
                  : "bg-white text-grey-700 border-grey-300 hover:bg-grey-50 hover:border-grey-400"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Lista de Solicitações */}
        <div className="space-y-6">
          {solicitacoesFiltradas.map((solicitacao) => (
            <Card key={solicitacao.id} className="p-6 border-grey-200 shadow-md hover:shadow-lg transition-shadow">
              {/* Header da Solicitação */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary-lighter rounded-lg">
                    <User className="w-6 h-6 text-secondary-main" />
                  </div>
                  <div>
                    <h3 className="font-bold text-grey-900 text-lg">{solicitacao.codigo}</h3>
                    <p className="text-sm text-grey-600">{solicitacao.produtor.nome}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(solicitacao.status)}`}>
                  {solicitacao.status}
                </span>
              </div>

              {/* Informações da Solicitação */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-grey-500" />
                  <div>
                    <span className="text-xs text-grey-500 block">Propriedade</span>
                    <span className="text-sm font-medium text-grey-900">{solicitacao.produtor.propriedade}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-grey-500" />
                  <div>
                    <span className="text-xs text-grey-500 block">Volume</span>
                    <span className="text-sm font-medium text-grey-900">{solicitacao.volume}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-grey-500" />
                  <div>
                    <span className="text-xs text-grey-500 block">Prazo</span>
                    <span className="text-sm font-medium text-grey-900">{solicitacao.prazoEntrega}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-grey-500" />
                  <div>
                    <span className="text-xs text-grey-500 block">Valor Estimado</span>
                    <span className="text-sm font-medium text-success-main">R$ {solicitacao.valorEstimado}</span>
                  </div>
                </div>
              </div>

              {/* Informações de Contato */}
              <div className="flex flex-wrap gap-4 mb-4 p-3 bg-grey-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-grey-500" />
                  <span className="text-sm text-grey-700">{solicitacao.produtor.telefone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-grey-500" />
                  <span className="text-sm text-grey-700">{solicitacao.produtor.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-grey-500" />
                  <span className="text-sm text-grey-700">Distância: {solicitacao.distancia}</span>
                </div>
              </div>

              {/* Observações */}
              {solicitacao.observacoes && (
                <div className="mb-4 p-3 bg-warning-lighter rounded-lg">
                  <p className="text-sm text-warning-dark">
                    <strong>Observações:</strong> {solicitacao.observacoes}
                  </p>
                </div>
              )}

              {/* Ações */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-grey-200">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleVerDetalhes(solicitacao.id)}
                  className="flex-1 border-grey-300 text-grey-700 hover:bg-grey-50"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Detalhes
                </Button>

                {solicitacao.status === "Pendente" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleAprovar(solicitacao.id)}
                      className="flex-1 bg-success-main hover:bg-success-dark text-white"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRejeitar(solicitacao.id)}
                      className="flex-1 bg-error-main hover:bg-error-dark text-white"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Rejeitar
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Estado vazio */}
        {solicitacoesFiltradas.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-grey-100 rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-grey-400" />
            </div>
            <h3 className="text-lg font-semibold text-grey-900 mb-2">
              {search || filtroStatus !== "Todos" ? "Nenhuma solicitação encontrada" : "Nenhuma solicitação recebida"}
            </h3>
            <p className="text-grey-600 max-w-md">
              {search || filtroStatus !== "Todos"
                ? "Tente ajustar os filtros ou termos de busca."
                : "Quando produtores rurais solicitarem lodo, elas aparecerão aqui."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
