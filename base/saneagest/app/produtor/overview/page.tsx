"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  Plus,
  Factory,
  Droplets,
  Clock,
  FileText,
  BarChart3,
  HelpCircle,
} from "lucide-react";
import { PageLoadingSkeleton } from "@/components/LoadingSkeleton";

const metricas = [
  {
    valor: "6 ETEs",
    label: "ETEs Parceiras",
    icon: Factory,
    iconColor: "text-white",
    iconBgColor: "bg-info-main",
    trend: "2 novas este mês",
    trendColor: "text-success-main",
  },
  {
    valor: "52.000 L",
    label: "Lodo Recebido",
    icon: Droplets,
    iconColor: "text-white",
    iconBgColor: "bg-success-main",
    trend: "+18% vs mês anterior",
    trendColor: "text-success-main",
  },
  {
    valor: "5 pendentes",
    label: "Solicitações em andamento",
    icon: Clock,
    iconColor: "text-white",
    iconBgColor: "bg-warning-main",
    trend: "2 urgentes",
    trendColor: "text-error-main",
  },
  {
    valor: "2",
    label: "Documentos pendentes",
    icon: FileText,
    iconColor: "text-white",
    iconBgColor: "bg-error-main",
    trend: "Vencimento próximo",
    trendColor: "text-error-main",
  },
];

const propriedadesDestaque = [
  {
    nome: "Fazenda Santa Luzia",
    localizacao: "Rua dos Bobos, 0",
    tipoCultura: "Hortaliças",
    areaHa: 10,
  },
  {
    nome: "Sítio Boa Esperança",
    localizacao: "Estrada do Campo, 123",
    tipoCultura: "Trigo",
    areaHa: 25,
  },
  {
    nome: "Chácara Primavera",
    localizacao: "Avenida das Flores, 45",
    tipoCultura: "Flores Ornamentais",
    areaHa: 5,
  },
];

export default function DashboardOverview() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  return (
    <div className="flex flex-col h-screen bg-grey-200">
      <Header title="Overview" showIcons={true} />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricas.map((metrica, index) => {
            const Icon = metrica.icon;
            return (
              <Card
                key={index}
                className="p-6 border-grey-200 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 ${metrica.iconBgColor} rounded-xl flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`w-6 h-6 ${metrica.iconColor}`} />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-grey-900 mb-1">
                    {metrica.valor}
                  </p>
                  <p className="text-sm text-grey-500 mb-2">{metrica.label}</p>
                  {metrica.trend && (
                    <p className={`text-xs font-medium ${metrica.trendColor}`}>
                      {metrica.trend}
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Ações Rápidas */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button className="bg-primary-main hover:bg-primary-dark text-white px-6 py-2 rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Nova Solicitação
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
            <HelpCircle className="w-4 h-4 mr-2" />
            Central de Ajuda
          </Button>
        </div>

        {/* Propriedades em Destaque */}
        <div>
          <h2 className="text-lg font-semibold text-grey-900 mb-4">
            Propriedades em Destaque
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propriedadesDestaque.map((propriedade, index) => (
              <Card
                key={index}
                className="p-6 border-grey-200 shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-grey-900 mb-4">
                  {propriedade.nome}
                </h3>
                <div className="space-y-2 text-sm text-grey-600 mb-4">
                  <p>
                    <span className="font-medium text-grey-700">
                      Localização:
                    </span>{" "}
                    {propriedade.localizacao}
                  </p>
                  <p>
                    <span className="font-medium text-grey-700">
                      Tipo de Cultura:
                    </span>{" "}
                    {propriedade.tipoCultura}
                  </p>
                  <p>
                    <span className="font-medium text-grey-700">Área:</span>{" "}
                    {propriedade.areaHa}ha
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-grey-300 text-grey-700 hover:bg-grey-50 bg-transparent"
                >
                  Ver Detalhes
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
