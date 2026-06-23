"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp } from "lucide-react";

interface HRVDataPoint {
  time: string;
  value: number;
  trend?: "up" | "down" | "stable";
}

export function HRVChart() {
  const [data, setData] = useState<HRVDataPoint[]>([]);
  const [currentValue, setCurrentValue] = useState(42.3);

  // Simular dados em tempo real
  useEffect(() => {
    const initialData: HRVDataPoint[] = [];
    const now = new Date();

    // Gerar dados das últimas 24 horas
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const baseValue = 42 + Math.sin(i * 0.5) * 8; // Variação natural
      const noise = (Math.random() - 0.5) * 4; // Ruído
      initialData.push({
        time: time.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        value: Math.max(20, Math.min(80, baseValue + noise)),
      });
    }

    setData(initialData);

    // Atualizar a cada 30 segundos
    const interval = setInterval(() => {
      const now = new Date();
      const newValue =
        42 + Math.sin(Date.now() / 10000) * 8 + (Math.random() - 0.5) * 3;
      const clampedValue = Math.max(20, Math.min(80, newValue));

      setCurrentValue(clampedValue);

      setData((prevData) => {
        const newData = [
          ...prevData.slice(1),
          {
            time: now.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            value: clampedValue,
          },
        ];
        return newData;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getTrendColor = () => {
    if (currentValue > 45) return "text-green-600";
    if (currentValue < 35) return "text-red-600";
    return "text-yellow-600";
  };

  const getTrendIcon = () => {
    if (currentValue > 45)
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    return <Activity className="h-4 w-4" />;
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium text-blue-900">
                Variabilidade Cardíaca (HRV)
              </CardTitle>
              <p className="text-xs text-blue-700">Tempo real • Últimas 24h</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              {getTrendIcon()}
              <span className={`text-2xl font-bold ${getTrendColor()}`}>
                {currentValue.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground ml-1">ms</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {currentValue > 45
                ? "Excelente"
                : currentValue > 35
                ? "Normal"
                : "Atenção"}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#64748b" }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[20, 80]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#64748b" }}
                width={25}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                labelStyle={{ color: "#334155", fontSize: "12px" }}
                formatter={(value: number) => [`${value.toFixed(1)} ms`, "HRV"]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 2 }}
                activeDot={{ r: 4, fill: "#1d4ed8" }}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Indicador de saúde do sistema nervoso autônomo</span>
          <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
