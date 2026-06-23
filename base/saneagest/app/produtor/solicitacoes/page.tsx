"use client"

import React from "react"
import Header from "@/components/Header"
import CardSolicitacao from "@/components/CardSolicitacao"
import { mockSolicitacoes } from "@/data/mockSolicitacoes"

export default function MinhasSolicitacoes() {
  const [search, setSearch] = React.useState("")

  const solicitacoesFiltradas = mockSolicitacoes.filter(
    (solicitacao) =>
      solicitacao.code.toLowerCase().includes(search.toLowerCase()) ||
      solicitacao.property.toLowerCase().includes(search.toLowerCase()) ||
      solicitacao.origin.toLowerCase().includes(search.toLowerCase()),
  )

  const handleViewDetails = (code: string) => {
    // TODO: Implementar visualização de detalhes
    console.log(`Ver detalhes da solicitação: ${code}`)
  }

  return (
    <div className="flex flex-col h-screen bg-grey-200">
      <Header title="Minhas Solicitações" searchValue={search} onSearch={setSearch} showIcons={true} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {solicitacoesFiltradas.map((solicitacao) => (
            <CardSolicitacao
              key={solicitacao.code}
              {...solicitacao}
              onViewDetails={() => handleViewDetails(solicitacao.code)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
