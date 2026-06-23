"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, AlertTriangle, CheckCircle } from "lucide-react";

interface EDADataPoint {
  time: string;
  value: number;
  stress_level: 'low' | 'normal' | 'high';
}

export function EDAChart() {
  const [data, setData] = useState<EDADataPoint[]>([]);
  const [currentValue, setCurrentValue] = useState(3.2);
  const [stressLevel, setStressLevel] = useState<'low' | 'normal' | 'high'>('normal');

  // Simular dados em tempo real
  useEffect(() => {
    const initialData: EDADataPoint[] = [];
    const now = new Date();
    
    // Gerar dados das últimas 2 horas (mais granular)
    for (let i = 119; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 1000); // A cada minuto
      const baseValue = 3 + Math.sin(i * 0.1) * 2; // Variação base
      const stress = Math.random() > 0.8 ? Math.random() * 3 : 0; // Picos de estresse ocasionais
      const value = Math.max(0.5, Math.min(10, baseValue + stress + (Math.random() - 0.5) * 0.5));
      
      let stress_level: 'low' | 'normal' | 'high' = 'normal';
      if (value < 2) stress_level = 'low';
      if (value > 6) stress_level = 'high';
      
      initialData.push({
        time: i % 10 === 0 ? time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '',
        value,
        stress_level
      });
    }
    
    setData(initialData);

    // Atualizar a cada 10 segundos (mais frequente para EDA)
    const interval = setInterval(() => {
      const now = new Date();
      const baseValue = 3 + Math.sin(Date.now() / 30000) * 2;
      const stress = Math.random() > 0.9 ? Math.random() * 4 : 0; // Picos ocasionais
      const newValue = Math.max(0.5, Math.min(10, baseValue + stress + (Math.random() - 0.5) * 0.3));
      
      let newStressLevel: 'low' | 'normal' | 'high' = 'normal';
      if (newValue < 2) newStressLevel = 'low';
      if (newValue > 6) newStressLevel = 'high';
      
      setCurrentValue(newValue);
      setStressLevel(newStressLevel);
      
      setData(prevData => {
        const newData = [...prevData.slice(1), {
          time: '',
          value: newValue,
          stress_level: newStressLevel
        }];
        
        // Adicionar timestamp a cada 10 pontos
        if (newData.length % 10 === 0) {
          newData[newData.length - 1].time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        }
        
        return newData;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStressColor = () => {
    switch (stressLevel) {
      case 'low': return "text-blue-600";
      case 'high': return "text-red-600";
      default: return "text-green-600";
    }
  };

  const getStressIcon = () => {
    switch (stressLevel) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default: return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  const getStressLabel = () => {
    switch (stressLevel) {
      case 'low': return "Relaxado";
      case 'high': return "Estresse Alto";
      default: return "Normal";
    }
  };

  const getGradientColor = () => {
    switch (stressLevel) {
      case 'high': return '#ef4444';
      case 'low': return '#3b82f6';
      default: return '#10b981';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Zap className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium text-green-900">
                Atividade Eletrodérmica (EDA)
              </CardTitle>
              <p className="text-xs text-green-700">Tempo real • Últimas 2h</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              {getStressIcon()}
              <span className={`text-2xl font-bold ${getStressColor()}`}>
                {currentValue.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground ml-1">µS</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {getStressLabel()}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="edaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getGradientColor()} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={getGradientColor()} stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#64748b' }}
              />
              <YAxis 
                domain={[0, 10]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#64748b' }}
                width={25}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ color: '#334155', fontSize: '12px' }}
                formatter={(value: number, name, props) => [
                  `${value.toFixed(1)} µS`,
                  'EDA',
                  props.payload.stress_level === 'high' ? '🔴 Alto estresse' : 
                  props.payload.stress_level === 'low' ? '🔵 Relaxado' : '🟢 Normal'
                ]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={getGradientColor()}
                strokeWidth={2}
                fill="url(#edaGradient)"
                animationDuration={800}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Condutividade da pele • Indicador de estresse emocional</span>
          <div className={`h-2 w-2 rounded-full animate-pulse ${
            stressLevel === 'high' ? 'bg-red-500' : 
            stressLevel === 'low' ? 'bg-blue-500' : 'bg-green-500'
          }`} />
        </div>
      </CardContent>
    </Card>
  );
}