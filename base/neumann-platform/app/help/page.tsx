"use client";

import {
    HelpCircle,
    Shield,
    Activity,
    Smartphone,
    Info,
    Mail,
    Phone,
    BookOpen,
    FileText,
    AlertTriangle,
    CheckCircle,
    Brain,
    Cpu,
} from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HelpPage() {
    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">Ajuda & Suporte</h1>
                    <p className="text-muted-foreground mt-1">
                        Informações oficiais sobre a plataforma Neumann e seus dispositivos.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <BookOpen className="h-4 w-4" />
                        Documentação Técnica
                    </Button>
                    <Button className="gap-2 bg-gradient-to-r from-primary to-accent border-0">
                        <Mail className="h-4 w-4" />
                        Contatar Suporte
                    </Button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - FAQs */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Device & Troubleshooting */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center dark:bg-blue-900/30">
                                    <Smartphone className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                                </div>
                                <div>
                                    <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Dispositivo Neumann</CardTitle>
                                    <p className="text-xs text-blue-700 dark:text-blue-300">
                                        Especificações e solução de problemas da pulseira
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="dev-1">
                                    <AccordionTrigger>
                                        Quais são as especificações da pulseira?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        <p>
                                            A pulseira Neumann é um dispositivo de segurança clínica (não EPI) com as seguintes características:
                                        </p>
                                        <ul className="list-disc pl-4 mt-2 space-y-1">
                                            <li><strong>Bateria:</strong> Duração de 7+ dias.</li>
                                            <li><strong>Resistência:</strong> Certificação IP68 (resistente a água e poeira).</li>
                                            <li><strong>Conectividade:</strong> WiFi e Bluetooth com backup automático via 4G.</li>
                                            <li><strong>Design:</strong> Discreto e sem tela para evitar distrações.</li>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="dev-2">
                                    <AccordionTrigger>
                                        O que a pulseira monitora exatamente?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        <p className="mb-2">A pulseira coleta 5 parâmetros principais:</p>
                                        <ul className="list-disc pl-4 space-y-1">
                                            <li><strong>Variação da Frequência Cardíaca (HRV):</strong> medido em milissegundos (ms).</li>
                                            <li><strong>Frequência Cardíaca:</strong> batimentos por minuto (bpm).</li>
                                            <li><strong>Movimento (Acelerometria):</strong> m/s², passos e distância.</li>
                                            <li><strong>Temperatura:</strong> Graus Celsius (°C).</li>
                                            <li><strong>Atividade Eletrodérmica (EDA):</strong> Microsiemens (µS), Ohms (Ω) ou Volts (V).</li>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>

                    {/* AI Intelligence Section */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center dark:bg-purple-900/30">
                                    <Brain className="h-4 w-4 text-purple-600 dark:text-purple-500" />
                                </div>
                                <div>
                                    <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">Inteligência Artificial</CardTitle>
                                    <p className="text-xs text-purple-700 dark:text-purple-300">
                                        Entenda como nossa IA protege sua saúde
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="ai-1">
                                    <AccordionTrigger>
                                        Como os alertas são gerados?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        <p>
                                            Utilizamos uma arquitetura híbrida de IA (Isolation Forest, LSTM, Random Forest, XGBoost)
                                            para criar um baseline individual para cada funcionário. O sistema detecta:
                                        </p>
                                        <ul className="list-disc pl-4 mt-2 space-y-1">
                                            <li><strong>Coração:</strong> Taquicardia, bradicardia, arritmias.</li>
                                            <li><strong>Mental:</strong> Estresse elevado, ansiedade, sinais de burnout (87% sensibilidade).</li>
                                            <li><strong>Físico:</strong> Fadiga, risco ergonômico, desidratação.</li>
                                        </ul>
                                        <p className="mt-2 text-xs italic">
                                            Nota: A pulseira não faz diagnóstico médico. Ela gera alertas preventivos para avaliação profissional.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="ai-2">
                                    <AccordionTrigger>
                                        O que é a 'Explicabilidade da IA'?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        <p>
                                            Diferente de sistemas "caixa-preta", todo alerta do Neumann inclui:
                                        </p>
                                        <ul className="list-disc pl-4 mt-2 space-y-1">
                                            <li><strong>Justificativa Técnica:</strong> Parâmetros exatos que dispararam o alerta.</li>
                                            <li><strong>Contexto Temporal:</strong> Duração e momento da ocorrência.</li>
                                            <li><strong>Nível de Confiança:</strong> Probabilidade estatística.</li>
                                            <li><strong>Recomendações:</strong> Ações baseadas em evidências (NR-7, PCMSO).</li>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>

                    {/* Privacy & LGPD Section */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center dark:bg-green-900/30">
                                    <Shield className="h-4 w-4 text-green-600 dark:text-green-500" />
                                </div>
                                <div>
                                    <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">Privacidade e Compliance</CardTitle>
                                    <p className="text-xs text-green-700 dark:text-green-300">
                                        Segurança de dados e normas regulatórias
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="lgpd-1">
                                    <AccordionTrigger>
                                        Quem tem acesso aos meus dados?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        <p className="mb-2">
                                            O sistema possui níveis de acesso rígidos:
                                        </p>
                                        <ul className="list-disc pl-4 space-y-1">
                                            <li><strong>Funcionário:</strong> Acessa apenas seus próprios dados.</li>
                                            <li><strong>Administrador SESST:</strong> Acesso técnico para saúde ocupacional.</li>
                                            <li><strong>Administrador RH:</strong> Apenas dados agregados/gerenciais.</li>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="lgpd-2">
                                    <AccordionTrigger>
                                        Quais certificações de segurança o sistema possui?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        <ul className="list-disc pl-4 space-y-1">
                                            <li><strong>Criptografia:</strong> End-to-end (AES-256).</li>
                                            <li><strong>Normas:</strong> ISO 27001 (Segurança da Informação), ISO 45001 (Saúde Ocupacional).</li>
                                            <li><strong>Regulatório:</strong> Conformidade com NR-7, NR-9 e diretrizes do CFM.</li>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - System Info */}
                <div className="space-y-6">
                    {/* Models Status Card */}
                    <Card className="bg-gradient-to-br from-primary/5 to-accent/10 border-primary/20">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Cpu className="h-5 w-5 text-primary" />
                                Modelos de IA Ativos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Isolation Forest</span>
                                    <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200 gap-1">
                                        Anomalias
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>LSTM Networks</span>
                                    <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200 gap-1">
                                        Séries Temporais
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>Random Forest</span>
                                    <Badge variant="outline" className="text-purple-600 bg-purple-50 border-purple-200 gap-1">
                                        Classificação
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>XGBoost</span>
                                    <Badge variant="outline" className="text-orange-600 bg-orange-50 border-orange-200 gap-1">
                                        Alta Performance
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Support */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Canais de Atendimento</CardTitle>
                            <CardDescription>
                                Suporte técnico especializado
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-muted/50">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Phone className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="font-medium">Emergência Técnica</p>
                                    <p className="text-muted-foreground">0800 NEUMANN</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">24/7</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-muted/50">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="font-medium">Suporte SESST</p>
                                    <p className="text-muted-foreground">sesst@neumann.com</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">SLA: 4 horas</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Manual Link */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <FileText className="h-24 w-24 transform rotate-12" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2 relative z-10">Manual NR-7</h3>
                        <p className="text-slate-300 text-sm mb-4 relative z-10">
                            Guia de implementação e conformidade com normas regulamentadoras.
                        </p>
                        <Button size="sm" variant="secondary" className="w-full relative z-10 hover:bg-white/90">
                            Acessar Guia
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
}
