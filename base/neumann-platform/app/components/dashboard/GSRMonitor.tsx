"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Lightbulb,
  RefreshCw,
  Wifi,
  WifiOff,
  Brain,
  Zap,
  Trash2,
  RotateCcw,
  Power,
  PowerOff,
  Zap as ZapIcon,
  Download,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface GSRData {
  conductance: number;
  resistance: number;
  emotion: string;
  led_enabled: boolean;
  led_pattern: number;
}

interface ChartDataPoint {
  time: string;
  conductance: number;
}

export function GSRMonitor() {
  const [isConnected, setIsConnected] = useState(false);
  const [gsrData, setGsrData] = useState<GSRData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("--");
  const [logs, setLogs] = useState<string[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  const ws = useRef<WebSocket | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS<"line"> | null>(null);

  const WS_SERVER = "ws://localhost:8080";
  const MAX_DATA_POINTS = 50;

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  // Inicializar o gráfico Chart.js
  useEffect(() => {
    const timer = setTimeout(() => {
      initChart();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, []);

  // Scroll automático no terminal quando logs mudarem
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    setLogs((prev) => [...prev.slice(-20), logEntry]);
    console.log(logEntry);
  };

  const connectWebSocket = () => {
    addLog("🌐 Conectando ao servidor Neumann...");

    try {
      ws.current = new WebSocket(WS_SERVER);

      ws.current.onopen = () => {
        setIsConnected(true);
        addLog("✅ Conectado ao servidor Neumann!");
        setTimeout(() => {
          sendCommand("get_data");
          addLog("📨 Solicitando dados do sensor biométrico...");
        }, 1000);
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as GSRData;
          addLog("📊 Dados RECEBIDOS do sensor!");
          setGsrData(data);
          updateChart(data.conductance);
          setLastUpdate(new Date().toLocaleTimeString());
        } catch (error) {
          addLog("❌ Erro ao processar dados: " + error);
        }
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        addLog("🔌 Conexão fechada - Tentando reconectar...");
        setTimeout(connectWebSocket, 3000);
      };

      ws.current.onerror = () => {
        addLog("❌ Erro de conexão");
      };
    } catch (error) {
      addLog("❌ Erro ao conectar: " + error);
    }
  };

  const sendCommand = (command: string) => {
    if (!isConnected || !ws.current) {
      addLog("❌ Não conectado ao servidor");
      return;
    }

    try {
      ws.current.send(command);
      addLog(`✅ Comando enviado: ${command}`);
    } catch (error) {
      addLog("❌ Erro ao enviar comando: " + error);
    }
  };

  // Arrays para dados do gráfico (como no HTML original)
  const conductanceData = useRef<number[]>([]);
  const timeLabels = useRef<string[]>([]);

  // Inicializar o gráfico Chart.js (exatamente como no HTML original)
  const initChart = () => {
    if (chartRef.current && !chartInstance.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        chartInstance.current = new ChartJS(ctx, {
          type: "line",
          data: {
            labels: timeLabels.current,
            datasets: [
              {
                label: "Condutância (µS)",
                data: conductanceData.current,
                borderColor: "#42d3ff",
                backgroundColor: "rgba(66, 211, 255, 0.1)",
                tension: 0.4,
                fill: true,
                pointBackgroundColor: "#42d3ff",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Condutância (µS)",
                  font: {
                    size: 11,
                  },
                },
                ticks: {
                  font: {
                    size: 10,
                  },
                },
                grid: {
                  color: "rgba(0, 0, 0, 0.1)",
                },
              },
              x: {
                ticks: {
                  maxTicksLimit: 30,
                  minRotation: 0,
                  maxRotation: 0,
                  autoSkip: false,
                  callback: function (value: any, index: number) {
                    const labels = this.getLabelForValue
                      ? this.getLabelForValue(value)
                      : "";
                    // Mostrar apenas a cada 3 pontos para evitar sobreposição na horizontal
                    return index % 3 === 0 ? labels : "";
                  },
                  font: {
                    size: 10,
                  },
                },
                title: {
                  display: true,
                  text: "Tempo",
                  font: {
                    size: 11,
                  },
                },
                grid: {
                  color: "rgba(0, 0, 0, 0.05)",
                },
              },
            },
          },
        });
      }
    }
  };

  // Atualizar gráfico (exatamente como no HTML original)
  const updateChart = (conductance: number) => {
    conductanceData.current.push(conductance);
    timeLabels.current.push(new Date().toLocaleTimeString());

    if (conductanceData.current.length > MAX_DATA_POINTS) {
      conductanceData.current.shift();
      timeLabels.current.shift();
    }

    if (chartInstance.current) {
      chartInstance.current.update("none");
    }

    // Manter o estado também para outras funcionalidades
    const newTime = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    setChartData((prev) => {
      const updated = [
        ...prev,
        {
          time: newTime,
          conductance: conductance,
        },
      ];
      return updated.length > MAX_DATA_POINTS
        ? updated.slice(-MAX_DATA_POINTS)
        : updated;
    });
  };

  const getEmotionDisplay = (emotion: string) => {
    const emotions: Record<
      string,
      { text: string; color: string; emoji: string }
    > = {
      very_relaxed: {
        text: "Muito Relaxado",
        color: "bg-green-500 text-white",
        emoji: "😴",
      },
      relaxed: {
        text: "Relaxado",
        color: "bg-green-400 text-white",
        emoji: "😊",
      },
      neutral: {
        text: "Normal",
        color: "bg-yellow-500 text-white",
        emoji: "😐",
      },
      activated: {
        text: "Ativado",
        color: "bg-orange-500 text-white",
        emoji: "😰",
      },
      stressed: {
        text: "Estressado",
        color: "bg-red-500 text-white",
        emoji: "😨",
      },
    };
    return (
      emotions[emotion] || {
        text: "--",
        color: "bg-gray-500 text-white",
        emoji: "❓",
      }
    );
  };

  const getLedPatternText = (pattern: number) => {
    const patterns: Record<number, string> = {
      1: "⏳ Muito Lento (2s)",
      2: "🐢 Lento (1s)",
      3: "🚶 Normal (0.5s)",
      4: "🏃 Rápido (0.25s)",
      5: "⚡ Muito Rápido (0.1s)",
    };
    return patterns[pattern] || "Desconhecido";
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="space-y-6">
      {/* <Card className="border-orange-200 bg-orange-50/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Badge
              variant="secondary"
              className="bg-orange-100 text-orange-800"
            >
              🧪 Ambiente de Testes
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Protótipo Neumann
            </Badge>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>Sistema:</strong> Monitor GSR (Galvanic Skin Response) -
              Condutância da Pele
            </p>
            <p>
              <strong>Propósito:</strong> Medição de ativação do sistema nervoso
              simpático através da condutância elétrica
            </p>
            <p>
              <strong>Aplicação:</strong> Detecção de estados emocionais e
              níveis de stress em tempo real
            </p>
          </div>
        </CardContent>
      </Card> */}

      {/* Informações do Sistema */}
      {/* Gráfico GSR - Design Compacto */}
      <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                <Activity className="h-4 w-4 text-cyan-600" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-cyan-900">
                  Condutância da Pele (GSR)
                </CardTitle>
                <p className="text-xs text-cyan-700">
                  Tempo real • Sensor Neumann
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span
                  className="text-2xl font-bold"
                  style={{ color: "#42d3ff" }}
                >
                  {gsrData ? gsrData.conductance.toFixed(1) : "--"}
                </span>
                <span className="text-xs text-muted-foreground ml-1">µS</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {gsrData
                  ? getEmotionDisplay(gsrData.emotion).text
                  : "Aguardando"}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-64 w-full">
            <canvas
              ref={chartRef}
              id="gsrChart"
              className="w-full h-full"
            ></canvas>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Condutância */}
        <Card
          className={`shadow-lg ${
            gsrData ? "ring-2 ring-primary ring-opacity-50 animate-pulse" : ""
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Condutância
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">
              {gsrData ? `${gsrData.conductance.toFixed(1)} µS` : "-- µS"}
            </div>
            <p className="text-xs text-muted-foreground">Condutância da pele</p>
          </CardContent>
        </Card>

        {/* Resistência */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resistência
            </CardTitle>
            <Zap className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {gsrData
                ? `${(gsrData.resistance / 1000).toFixed(0)} kΩ`
                : "-- kΩ"}
            </div>
            <p className="text-xs text-muted-foreground">
              Resistência elétrica
            </p>
          </CardContent>
        </Card>

        {/* Estado Emocional */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estado Emocional
            </CardTitle>
            <Brain className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            {gsrData ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {getEmotionDisplay(gsrData.emotion).emoji}
                  </span>
                  <div className="text-lg font-semibold gradient-text">
                    {getEmotionDisplay(gsrData.emotion).text}
                  </div>
                </div>
                <Badge className={getEmotionDisplay(gsrData.emotion).color}>
                  Estado detectado
                </Badge>
              </div>
            ) : (
              <div className="text-2xl text-muted-foreground">--</div>
            )}
          </CardContent>
        </Card>

        {/* Status LED */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status do LED
            </CardTitle>
            <Lightbulb className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    gsrData?.led_enabled
                      ? "bg-green-500 animate-pulse"
                      : "bg-red-500"
                  }`}
                ></div>
                <span className="font-medium">
                  {gsrData?.led_enabled ? "LIGADO" : "DESLIGADO"}
                </span>
              </div>
              {gsrData?.led_enabled && (
                <div className="text-xs text-muted-foreground">
                  {getLedPatternText(gsrData.led_pattern)}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Controles do Sensor Neumann</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              onClick={() => sendCommand("led_on")}
              disabled={!isConnected}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Power className="h-4 w-4 mr-2" />
              Ligar LED
            </Button>
            <Button
              onClick={() => sendCommand("led_off")}
              disabled={!isConnected}
              variant="destructive"
            >
              <PowerOff className="h-4 w-4 mr-2" />
              Desligar LED
            </Button>
            <Button
              onClick={() => sendCommand("led_blink")}
              disabled={!isConnected}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <ZapIcon className="h-4 w-4 mr-2" />
              Piscar LED
            </Button>
            <Button
              onClick={() => sendCommand("get_data")}
              disabled={!isConnected}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Atualizar Dados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status da Conexão */}
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Wifi className="h-5 w-5 text-green-500" />
                <span className="text-green-500">●</span> Sensor Neumann
                Conectado
              </>
            ) : (
              <>
                <WifiOff className="h-5 w-5 text-red-500" />
                <span className="text-red-500">●</span> Sensor Desconectado
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Terminal de Logs */}
          <div
            ref={terminalRef}
            className="bg-black text-green-400 p-4 rounded-lg max-h-40 overflow-y-auto text-sm font-mono border border-gray-800 scroll-smooth scrollbar-none"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div className="flex items-center gap-2 mb-2 text-green-300 border-b border-gray-800 pb-2">
              <span className="text-xs animate-pulse">●</span>
              <span className="text-xs font-bold">NEUMANN TERMINAL v1.0.0</span>
              <span className="text-xs text-gray-500 ml-auto">GSR Monitor</span>
            </div>
            <div className="mt-2 space-y-1">
              {logs.length === 0 ? (
                <div className="text-gray-500 animate-pulse">
                  <span className="text-green-400">neumann@gsr:~$</span>{" "}
                  Aguardando logs do sistema...
                </div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="leading-tight">
                    <span className="text-gray-400">neumann@gsr:~$</span>{" "}
                    <span className="text-green-400">{log}</span>
                  </div>
                ))
              )}
              <div className="flex items-center">
                <span className="text-gray-400">neumann@gsr:~$</span>
                <span className="ml-1 bg-green-400 w-2 h-4 animate-pulse"></span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              onClick={clearLogs}
              variant="outline"
              className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Terminal
            </Button>
            <Button
              size="sm"
              onClick={connectWebSocket}
              variant="outline"
              className="bg-blue-800 border-blue-700 text-blue-300 hover:bg-blue-700 hover:text-white"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reconectar Sensor
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

