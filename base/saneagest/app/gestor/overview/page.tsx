"use client";

import Header from "@/components/Header";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/MetricCard";
import {
  Factory,
  Droplets,
  Clock,
  DollarSign,
  Users,
  BarChart3,
  Plus,
  AlertTriangle,
  CheckCircle,
  Edit,
  Eye,
  Check,
  Calendar,
  MapPin,
} from "lucide-react";
import {
  etesGestor,
  solicitacoesRecebidas,
  metricasGestor,
} from "@/data/mockGestor";

export default function GestorOverview() {
  const metricas = [
    {
      valor: metricasGestor.etesAtivas.toString(),
      label: "ETEs Ativas",
      icon: Factory,
      iconColor: "text-white",
      iconBgColor: "bg-secondary-main",
      trend: "+2 este mês",
      trendColor: "text-success-main",
    },
    {
      valor: metricasGestor.lodoProduzidoMes,
      label: "Lodo Produzido (mês)",
      icon: Droplets,
      iconColor: "text-white",
      iconBgColor: "bg-info-main",
      trend: "+15% vs mês anterior",
      trendColor: "text-success-main",
    },
    {
      valor: metricasGestor.solicitacoesPendentes.toString(),
      label: "Solicitações Pendentes",
      icon: Clock,
      iconColor: "text-white",
      iconBgColor: "bg-warning-main",
      trend: "3 urgentes",
      trendColor: "text-error-main",
    },
    {
      valor: `R$ ${(metricasGestor.receitaMensal / 1000).toFixed(0)}k`,
      label: "Receita Mensal",
      icon: DollarSign,
      iconColor: "text-white",
      iconBgColor: "bg-success-main",
      trend: `+${metricasGestor.margemLucro}% margem`,
      trendColor: "text-success-main",
    },
  ];

  const alertas = [
    {
      tipo: "warning",
      titulo: "Manutenção Programada",
      descricao: "ETE Sul Residencial - Manutenção em 5 dias",
      acao: "Ver Detalhes",
    },
    {
      tipo: "error",
      titulo: "Licença Vencendo",
      descricao: "Renovar licença ambiental da ETE Norte Industrial",
      acao: "Renovar",
    },
    {
      tipo: "success",
      titulo: "Meta Atingida",
      descricao: "Produção mensal superou meta em 12%",
      acao: "Ver Relatório",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativa":
      case "Aprovada":
        return "bg-success-lighter text-success-dark";
      case "Manutenção":
      case "Pendente":
        return "bg-warning-lighter text-warning-dark";
      case "Em Análise":
        return "bg-info-lighter text-info-dark";
      case "Inativa":
      case "Rejeitada":
        return "bg-error-lighter text-error-dark";
      default:
        return "bg-grey-100 text-grey-600";
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header title="Dashboard do Gestor" showIcons={true} />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricas.map((metrica, index) => (
            <MetricCard
              key={index}
              value={metrica.valor}
              label={metrica.label}
              icon={metrica.icon}
              iconColor={metrica.iconColor}
              iconBgColor={metrica.iconBgColor}
              trend={metrica.trend}
              trendColor={metrica.trendColor}
            />
          ))}
        </div>

        {/* Ações Rápidas */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button className="bg-secondary-main hover:bg-secondary-dark text-white px-6 py-2 rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Nova ETE
          </Button>
          <Button
            variant="outline"
            className="border-grey-300 text-grey-700 hover:bg-grey-50 px-6 py-2 rounded-xl bg-transparent"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Relatório Mensal
          </Button>
          <Button
            variant="outline"
            className="border-grey-300 text-grey-700 hover:bg-grey-50 px-6 py-2 rounded-xl bg-transparent"
          >
            <Users className="w-4 h-4 mr-2" />
            Gerenciar Equipe
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ETEs em Destaque */}
          <div>
            <h2 className="text-lg font-semibold text-grey-900 mb-4">
              Minhas ETEs
            </h2>
            <div className="space-y-4">
              {etesGestor.slice(0, 3).map((ete) => (
                <Card
                  key={ete.id}
                  className="p-6 border-grey-200 shadow-md hover:shadow-lg transition-shadow"
                >
                  {/* Header do Card */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-secondary-lighter rounded-xl flex items-center justify-center flex-shrink-0">
                        <Factory className="w-6 h-6 text-secondary-main" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-grey-900 text-lg truncate">
                          {ete.nome}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-grey-600">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{ete.endereco}</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium flex-shrink-0 ${getStatusColor(
                        ete.status
                      )}`}
                    >
                      {ete.status}
                    </span>
                  </div>

                  {/* Conteúdo do Card - Grid 2x2 */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                      <span className="text-xs text-grey-500 uppercase tracking-wide">
                        Capacidade
                      </span>
                      <p className="font-semibold text-grey-900">
                        {ete.capacidade}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-grey-500 uppercase tracking-wide">
                        Utilização
                      </span>
                      <p
                        className={`font-semibold ${
                          ete.capacidadeAtual >= 90
                            ? "text-error-main"
                            : ete.capacidadeAtual >= 75
                            ? "text-warning-main"
                            : "text-success-main"
                        }`}
                      >
                        {ete.capacidadeAtual}%
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-grey-500 uppercase tracking-wide">
                        Funcionários
                      </span>
                      <p className="font-semibold text-grey-900">
                        {ete.funcionarios}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-grey-500 uppercase tracking-wide">
                        Receita/mês
                      </span>
                      <p className="font-semibold text-success-main">
                        R$ {(ete.receitaMensal / 1000).toFixed(0)}k
                      </p>
                    </div>
                  </div>

                  {/* Informação Adicional */}
                  <div className="mb-4 p-3 bg-grey-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-grey-500" />
                      <span className="text-grey-600">
                        Próxima manutenção:{" "}
                      </span>
                      <span className="font-medium text-grey-900">
                        {ete.proximaManutencao}
                      </span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-3 pt-4 border-t border-grey-200">
                    <Button
                      size="sm"
                      className="flex-1 bg-secondary-main hover:bg-secondary-dark text-white"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-grey-300 text-grey-700 hover:bg-grey-50 bg-transparent"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Solicitações Recentes */}
          <div>
            <h2 className="text-lg font-semibold text-grey-900 mb-4">
              Solicitações Recentes
            </h2>
            <div className="space-y-4">
              {solicitacoesRecebidas.slice(0, 3).map((solicitacao) => (
                <Card
                  key={solicitacao.id}
                  className="p-6 border-grey-200 shadow-md hover:shadow-lg transition-shadow"
                >
                  {/* Header do Card */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-info-lighter rounded-xl flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-info-main" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-grey-900 text-lg truncate">
                          {solicitacao.codigo}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-grey-600">
                          <Users className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">
                            {solicitacao.produtor.nome}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium flex-shrink-0 ${getStatusColor(
                        solicitacao.status
                      )}`}
                    >
                      {solicitacao.status}
                    </span>
                  </div>

                  {/* Conteúdo do Card - Grid 2x2 */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                      <span className="text-xs text-grey-500 uppercase tracking-wide">
                        Volume
                      </span>
                      <p className="font-semibold text-grey-900">
                        {solicitacao.volume}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-grey-500 uppercase tracking-wide">
                        Valor
                      </span>
                      <p className="font-semibold text-success-main">
                        R$ {solicitacao.valorEstimado}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-grey-500 uppercase tracking-wide">
                        Distância
                      </span>
                      <p className="font-semibold text-grey-900">
                        {solicitacao.distancia}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-grey-500 uppercase tracking-wide">
                        Propriedade
                      </span>
                      <p className="font-semibold text-grey-900 truncate">
                        {solicitacao.produtor.propriedade}
                      </p>
                    </div>
                  </div>

                  {/* Informação Adicional */}
                  <div className="mb-4 p-3 bg-grey-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-grey-500" />
                      <span className="text-grey-600">Prazo de entrega: </span>
                      <span className="font-medium text-grey-900">
                        {solicitacao.prazoEntrega}
                      </span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-3 pt-4 border-t border-grey-200">
                    <Button
                      size="sm"
                      className="flex-1 bg-secondary-main hover:bg-secondary-dark text-white"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Processar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-grey-300 text-grey-700 hover:bg-grey-50 bg-transparent"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Alertas e Notificações */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-grey-900 mb-4">
            Alertas e Notificações
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alertas.map((alerta, index) => (
              <Card key={index} className="p-6 border-grey-200 shadow-md">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0">
                    {alerta.tipo === "warning" && (
                      <div className="w-12 h-12 bg-warning-lighter rounded-xl flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-warning-main" />
                      </div>
                    )}
                    {alerta.tipo === "error" && (
                      <div className="w-12 h-12 bg-error-lighter rounded-xl flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-error-main" />
                      </div>
                    )}
                    {alerta.tipo === "success" && (
                      <div className="w-12 h-12 bg-success-lighter rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-success-main" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-grey-900 mb-1">
                      {alerta.titulo}
                    </h3>
                    <p className="text-sm text-grey-600 mb-3">
                      {alerta.descricao}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs bg-transparent"
                    >
                      {alerta.acao}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
