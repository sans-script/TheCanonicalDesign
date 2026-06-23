"use client";

import { useEffect, useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Target, CheckCircle, AlertCircle } from "lucide-react";

interface AIMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

interface AlertTypeData {
  type: string;
  alerts: number;
  accuracy: number;
  fill: string;
}

export function AIEfficiencyChart() {
  const [metrics, setMetrics] = useState<AIMetrics>({
    accuracy: 94.8,
    precision: 92.3,
    recall: 96.1,
    f1Score: 94.2,
  });

  const [alertData, setAlertData] = useState<AlertTypeData[]>([
    { type: "Críticos", alerts: 3, accuracy: 98.5, fill: "#ef4444" },
    { type: "Avisos", alerts: 5, accuracy: 91.2, fill: "#f59e0b" },
    { type: "Info", alerts: 12, accuracy: 94.8, fill: "#3b82f6" },
  ]);

  // Simular atualizações das métricas da IA
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        accuracy: Math.max(
          85,
          Math.min(99, prev.accuracy + (Math.random() - 0.5) * 2)
        ),
        precision: Math.max(
          80,
          Math.min(98, prev.precision + (Math.random() - 0.5) * 3)
        ),
        recall: Math.max(
          85,
          Math.min(99, prev.recall + (Math.random() - 0.5) * 2)
        ),
        f1Score: Math.max(
          82,
          Math.min(97, prev.f1Score + (Math.random() - 0.5) * 2.5)
        ),
      }));

      setAlertData((prev) =>
        prev.map((item) => ({
          ...item,
          alerts: Math.max(
            0,
            item.alerts + Math.floor((Math.random() - 0.7) * 3)
          ),
          accuracy: Math.max(
            85,
            Math.min(99, item.accuracy + (Math.random() - 0.5) * 1.5)
          ),
        }))
      );
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const radialData = [
    {
      name: "Precisão",
      value: metrics.accuracy,
      fill: "#10b981",
    },
  ];

  const getAccuracyColor = () => {
    if (metrics.accuracy >= 95) return "text-green-600";
    if (metrics.accuracy >= 90) return "text-yellow-600";
    return "text-red-600";
  };

  const getAccuracyStatus = () => {
    if (metrics.accuracy >= 95) return "Excelente";
    if (metrics.accuracy >= 90) return "Bom";
    return "Atenção";
  };

  const getAccuracyIcon = () => {
    if (metrics.accuracy >= 95)
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (metrics.accuracy >= 90)
      return <Target className="h-4 w-4 text-yellow-600" />;
    return <AlertCircle className="h-4 w-4 text-red-600" />;
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Brain className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium text-purple-900">
                Eficiência da IA
              </CardTitle>
              <p className="text-xs text-purple-700">Métricas em tempo real</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              {getAccuracyIcon()}
              <span className={`text-2xl font-bold ${getAccuracyColor()}`}>
                {metrics.accuracy.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground ml-1">%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {getAccuracyStatus()}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4">
          {/* Gráfico Radial de Precisão */}
          <div className="relative">
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="85%"
                  data={radialData}
                >
                  <RadialBar
                    dataKey="value"
                    cornerRadius={2}
                    fill="#10b981"
                    animationDuration={1000}
                  />
                  {/* <Tooltip
                    formatter={(value: number) => [
                      `${value.toFixed(1)}%`,
                      "Precisão",
                    ]}
                  /> */}
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            {/* Texto centralizado sobre o gráfico com posicionamento absoluto */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-xs font-bold text-green-600">
                {metrics.accuracy.toFixed(1)}%
              </div>
              {/* <div className="text-xs text-muted-foreground">Accuracy</div> */}
            </div>
          </div>

          {/* Gráfico de Barras - Alertas por Tipo */}
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={alertData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <XAxis
                  dataKey="type"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 8, fill: "#64748b" }}
                />
                <YAxis hide />
                {/* <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number, name) => [
                    name === "alerts"
                      ? `${value} alertas`
                      : `${value.toFixed(1)}% precisão`,
                    name === "alerts" ? "Quantidade" : "Precisão",
                  ]}
                /> */}
                <Bar
                  dataKey="alerts"
                  radius={[2, 2, 0, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Métricas Detalhadas */}
        <div className="mt-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              Precisão (Precision)
            </span>
            <span className="text-xs font-medium">
              {metrics.precision.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              Sensibilidade (Recall)
            </span>
            <span className="text-xs font-medium">
              {metrics.recall.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">F1-Score</span>
            <span className="text-xs font-medium">
              {metrics.f1Score.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <span>Algoritmos ML executando</span>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse" />
            <span>IA Ativa</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
