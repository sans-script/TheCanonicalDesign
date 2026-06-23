"use client"

import React from "react"
import Header from "@/components/Header"
import { Button } from "@/components/ui/Button"
import { MetricCard } from "@/components/MetricCard"
import { ListCard } from "@/components/ListCard"
import {
  Factory,
  Users,
  Droplets,
  Shield,
  DollarSign,
  Edit,
  Trash2,
  Plus,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { etesGestor } from "@/data/mockGestor"

export default function MinhasETEs() {
  const [search, setSearch] = React.useState("")

  const etesFiltradas = etesGestor.filter(
    (ete) =>
      ete.nome.toLowerCase().includes(search.toLowerCase()) ||
      ete.endereco.toLowerCase().includes(search.toLowerCase()),
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Ativa":
        return <CheckCircle className="w-5 h-5 text-success-main" />
      case "Manutenção":
        return <AlertTriangle className="w-5 h-5 text-warning-main" />
      case "Inativa":
        return <AlertTriangle className="w-5 h-5 text-error-main" />
      default:
        return <Factory className="w-5 h-5 text-grey-500" />
    }
  }

  const getCapacidadeColor = (capacidade: number) => {
    if (capacidade >= 90) return "text-error-main"
    if (capacidade >= 75) return "text-warning-main"
    return "text-success-main"
  }

  const resumoMetricas = [
    {
      valor: etesGestor.filter((e) => e.status === "Ativa").length.toString(),
      label: "ETEs Ativas",
      icon: Factory,
      iconColor: "text-white",
      iconBgColor: "bg-success-main",
    },
    {
      valor: `${etesGestor.reduce((acc, ete) => acc + ete.producaoDiaria, 0).toLocaleString()}L`,
      label: "Produção Diária",
      icon: Droplets,
      iconColor: "text-white",
      iconBgColor: "bg-info-main",
    },
    {
      valor: etesGestor.reduce((acc, ete) => acc + ete.funcionarios, 0).toString(),
      label: "Funcionários",
      icon: Users,
      iconColor: "text-white",
      iconBgColor: "bg-warning-main",
    },
    {
      valor: `R$ ${(etesGestor.reduce((acc, ete) => acc + ete.receitaMensal, 0) / 1000).toFixed(0)}k`,
      label: "Receita Mensal",
      icon: DollarSign,
      iconColor: "text-white",
      iconBgColor: "bg-secondary-main",
    },
  ]

  return (
    <div className="flex flex-col h-screen">
      <Header title="Minhas ETEs" searchValue={search} onSearch={setSearch} showIcons={true} />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Header da página */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl lg:text-2xl font-bold text-grey-900 truncate">Gestão de ETEs</h1>
            <p className="text-sm text-grey-600 mt-1">Gerencie suas estações de tratamento de esgoto</p>
          </div>
          <Button className="bg-secondary-main hover:bg-secondary-dark text-white px-4 py-2 rounded-xl w-full sm:w-auto flex-shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            Nova ETE
          </Button>
        </div>

        {/* Resumo das ETEs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {resumoMetricas.map((metrica, index) => (
            <MetricCard
              key={index}
              value={metrica.valor}
              label={metrica.label}
              icon={metrica.icon}
              iconColor={metrica.iconColor}
              iconBgColor={metrica.iconBgColor}
            />
          ))}
        </div>

        {/* Lista de ETEs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {etesFiltradas.map((ete) => (
            <ListCard
              key={ete.id}
              title={ete.nome}
              subtitle={ete.endereco}
              status={ete.status}
              statusColor={
                ete.status === "Ativa"
                  ? "bg-success-lighter text-success-dark"
                  : ete.status === "Manutenção"
                    ? "bg-warning-lighter text-warning-dark"
                    : "bg-error-lighter text-error-dark"
              }
              icon={Factory}
              iconColor="text-secondary-main"
              iconBgColor="bg-secondary-lighter"
              actions={[
                {
                  label: "Editar",
                  icon: Edit,
                  className: "bg-secondary-main hover:bg-secondary-dark text-white",
                },
                {
                  label: "Relatórios",
                  variant: "outline",
                  icon: TrendingUp,
                  className: "border-grey-300 text-grey-700 hover:bg-grey-50 bg-transparent",
                },
                {
                  label: "",
                  variant: "destructive",
                  icon: Trash2,
                  className: "bg-error-main hover:bg-error-dark text-white px-3",
                },
              ]}
            >
              <div className="space-y-4">
                {/* Métricas da ETE */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-grey-500">Capacidade</span>
                      <p className="font-semibold text-grey-900">{ete.capacidade}</p>
                    </div>
                    <div>
                      <span className="text-sm text-grey-500">Utilização</span>
                      <p className={`font-semibold ${getCapacidadeColor(ete.capacidadeAtual)}`}>
                        {ete.capacidadeAtual}%
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-grey-500">Funcionários</span>
                      <p className="font-semibold text-grey-900">{ete.funcionarios}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-grey-500">Produção Diária</span>
                      <p className="font-semibold text-grey-900">{ete.producaoDiaria.toLocaleString()}L</p>
                    </div>
                    <div>
                      <span className="text-sm text-grey-500">Receita Mensal</span>
                      <p className="font-semibold text-success-main">R$ {(ete.receitaMensal / 1000).toFixed(0)}k</p>
                    </div>
                    <div>
                      <span className="text-sm text-grey-500">Próxima Manutenção</span>
                      <p className="font-semibold text-grey-900">{ete.proximaManutencao}</p>
                    </div>
                  </div>
                </div>

                {/* Tipos de Lodo */}
                <div>
                  <span className="text-sm text-grey-500 mb-2 block">Tipos de Lodo</span>
                  <div className="flex flex-wrap gap-2">
                    {ete.tipoLodo.map((tipo, index) => (
                      <span key={index} className="px-2 py-1 bg-grey-100 text-grey-700 rounded-full text-xs">
                        {tipo}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status das Licenças */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg">
                    <Shield className={`w-4 h-4 ${ete.licencasValidas ? "text-success-main" : "text-error-main"}`} />
                  </div>
                  <span
                    className={`text-sm font-medium ${ete.licencasValidas ? "text-success-main" : "text-error-main"}`}
                  >
                    {ete.licencasValidas ? "Licenças Válidas" : "Licenças Pendentes"}
                  </span>
                </div>
              </div>
            </ListCard>
          ))}
        </div>

        {/* Estado vazio */}
        {etesFiltradas.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-grey-100 rounded-full flex items-center justify-center mb-4">
              <Factory className="w-8 h-8 text-grey-400" />
            </div>
            <h3 className="text-lg font-semibold text-grey-900 mb-2">
              {search ? "Nenhuma ETE encontrada" : "Nenhuma ETE cadastrada"}
            </h3>
            <p className="text-grey-600 max-w-md">
              {search
                ? "Tente ajustar os termos de busca ou limpar o filtro."
                : "Comece cadastrando sua primeira ETE para gerenciar a produção de lodo."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
