"use client";

import {
  Heart,
  Activity,
  Thermometer,
  Zap,
  Users,
  TrendingUp,
  Brain,
  Shield,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { HRVChart } from "@/components/dashboard/HRVChart";
import { EDAChart } from "@/components/dashboard/EDAChart";
import { AIEfficiencyChart } from "@/components/dashboard/AIEfficiencyChart";

const mockAlerts = [
  {
    id: "1",
    type: "critical" as const,
    title: "Taquicardia Detectada",
    description:
      "Funcionário no setor A apresenta FC > 120 bpm por mais de 15 minutos consecutivos.",
    employee: "João Silva - Operador de Produção",
    time: "2 min",
    confidence: 92,
  },
  {
    id: "2",
    type: "warning" as const,
    title: "Estresse Elevado",
    description: "Funcionário no setor B com EDA elevado (>8µS) e HRV baixo detectados.",
    employee: "Maria Santos - Supervisora",
    time: "8 min",
    confidence: 78,
  },
  {
    id: "3",
    type: "info" as const,
    title: "Padrão de Movimento Irregular",
    description: "Detectado movimento repetitivo anormal no setor B.",
    employee: "Carlos Oliveira - Técnico",
    time: "12 min",
    confidence: 85,
  },
];

export default function Page() {
  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
            <p className="mt-1 gradient-text">
              Monitoramento em tempo real • 150 funcionários ativos • IA ativa
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-muted-foreground pb-1">Sistema Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Funcionários Monitorados"
          value="150"
          icon={Users}
          change={5.2}
          changeType="positive"
          description="150 de 165 funcionários ativos"
          helpText="Número total de funcionários com pulseiras Neumann ativas e transmitindo dados em tempo real."
          gradient
        />

        <MetricCard
          title="Freq. Cardíaca Média"
          value="74"
          unit="bpm"
          icon={Heart}
          change={-2.1}
          changeType="positive"
          description="Média das últimas 24h"
          helpText="Frequência cardíaca média de todos os funcionários. Valores normais: 60-100 bpm em repouso."
        />

        <MetricCard
          title="Alertas Ativos"
          value="8"
          icon={Brain}
          change={15.3}
          changeType="negative"
          description="3 críticos, 5 avisos"
          helpText="Alertas gerados pela IA baseados em padrões de risco detectados nos dados biométricos."
        />

        <MetricCard
          title="Temperatura Média"
          value="36.2"
          unit="°C"
          icon={Thermometer}
          change={0.8}
          changeType="neutral"
          description="Temperatura corporal"
          helpText="Temperatura média da pele dos funcionários. Valores normais: 35.5-37.0°C."
        />
      </div> */}

      {/* Additional Metrics - Comentado para manter os metric cards antigos */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="HRV Médio"
          value="42.3"
          unit="ms"
          icon={Activity}
          change={8.7}
          changeType="positive"
          description="Variabilidade Cardíaca"
          helpText="Variação da Frequência Cardíaca - indicador de saúde do sistema nervoso autônomo. Valores maiores são melhores."
        />

        <MetricCard
          title="EDA Médio"
          value="3.2"
          unit="µS"
          icon={Zap}
          change={-5.2}
          changeType="positive"
          description="Atividade Eletrodérmica"
          helpText="Medida da condutividade da pele, relacionada ao estado emocional e nível de estresse."
        />

        <MetricCard
          title="Eficiência IA"
          value="94.8"
          unit="%"
          icon={Brain}
          change={2.3}
          changeType="positive"
          description="Precisão dos Alertas"
          helpText="Taxa de precisão do sistema de IA na detecção de anomalias e padrões de risco."
        />
      </div> */}

      {/* Alerts Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Alertas Inteligentes</h2>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-sm text-muted-foreground">
              IA Monitorando • LGPD Compliant
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mockAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAction={(alertId, action) => {
                console.log(`Action ${action} for alert ${alertId}`);
              }}
            />
          ))}
        </div>
      </div>

      {/* Gráficos Animados de Métricas Biométricas */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <HRVChart />
        <EDAChart />
        <AIEfficiencyChart />
      </div>

      {/* System Status */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Sistema Seguro</h3>
                <p className="text-sm text-green-700">Criptografia AES-256</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Conectividade</h3>
                <p className="text-sm text-blue-700">98.7% uptime</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 gradient-neumann rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">IA Ativa</h3>
                <p className="text-sm text-muted-foreground">
                  Algoritmos ML executando
                </p>
              </div>
            </div>
          </div>
        </div> */}
    </>
  );
}
