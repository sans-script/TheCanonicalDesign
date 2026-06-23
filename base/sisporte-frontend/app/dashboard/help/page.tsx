"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Users,
  CreditCard,
  Search,
  Lock,
  FileCheck,
  HelpCircle,
  Smartphone,
  Printer,
  ShieldCheck,
  PenTool,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";

export default function HelpPage() {
  return (
    <div className="space-y-6 pb-10">
      <div className="space-y-1.5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Ajuda</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-bold text-primary">
          Suporte e Orientação
        </h1>
        <p className="text-muted-foreground text-sm">
          Guia para utilização das funcionalidades do sistema
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-lg font-semibold">
              Gestão de Identidades
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            Controle de dados funcionais, fotografias e status (Ativo/Inativo).
            Inclui também a gestão da situação do porte de arma de cada guarda.
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-2">
              <Printer className="w-5 h-5 text-emerald-600" />
            </div>
            <CardTitle className="text-lg font-semibold">
              Impressão em Lote
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            Geração de carteiras funcionais individuais ou em lote. A impressão
            segue o padrão oficial da norma ISO/IEC 7810 para cartões de
            identificação.
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-2">
              <PenTool className="w-5 h-5 text-amber-600" />
            </div>
            <CardTitle className="text-lg font-semibold">
              Captura de Assinatura
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            Coleta da assinatura através de dispositivos móveis, desenho manual
            ou envio de imagem, com opções de alinhamento e redimensionamento.
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
            </div>
            <CardTitle className="text-lg font-semibold">
              Auditoria de Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            Monitoramento completo de todas as ações realizadas no sistema. Gera
            registros rastreáveis que podem ser exportados para Excel.
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center mb-2">
              <Lock className="w-5 h-5 text-rose-600" />
            </div>
            <CardTitle className="text-lg font-semibold">
              Segurança e Acessos
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            Sistema inteligente contra tentativas de invasão. Após 5 falhas seguidas no login, o sistema aplica bloqueios progressivos (5 minutos, 1 hora, 24 horas e banimento permanente).
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-2">
              <FileCheck className="w-5 h-5 text-blue-600" />
            </div>
            <CardTitle className="text-lg font-semibold">
              Validação Digital
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            Cada QR Code de carteira direciona para a checagem oficial da
            validade. Basta escanear o código com a câmera do celular para
            verificar se a carteira é válida.
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          Perguntas Frequentes
        </h2>

        <Accordion
          type="single"
          collapsible
          className="w-full bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm"
        >
          <AccordionItem
            value="item-1"
            className="px-6 border-b border-slate-100"
          >
            <AccordionTrigger className="hover:no-underline py-5 text-slate-700 font-semibold text-left">
              Como funciona o processo de assinatura pelo celular?
            </AccordionTrigger>
            <AccordionContent className="text-slate-500 pb-5 leading-relaxed">
              Para coletar a rubrica do secretário, acesse a página de
              "Assinaturas" e escaneie o QR Code com o smartphone. O dispositivo
              servirá como um pad de assinatura e a imagem será salva para todas
              as carteiras do sistema. A assinatura do guarda pode ser coletada
              durante o seu cadastro no sistema.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-2"
            className="px-6 border-b border-slate-100"
          >
            <AccordionTrigger className="hover:no-underline py-5 text-slate-700 font-semibold text-left">
              Qual a validade do link de assinatura remota?
            </AccordionTrigger>
            <AccordionContent className="text-slate-500 pb-5 leading-relaxed">
              Por questões de segurança, o link gerado em "Assinaturas" tem
              validade de 15 minutos. Caso o tempo expire antes da coleta ser
              concluída, basta gerar um novo código no painel administrativo.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-3"
            className="px-6 border-b border-slate-100"
          >
            <AccordionTrigger className="hover:no-underline py-5 text-slate-700 font-semibold text-left">
              Como é verificada a autenticidade da carteira física?
            </AccordionTrigger>
            <AccordionContent className="text-slate-500 pb-5 leading-relaxed">
              Qualquer pessoa pode ler o QR Code da carteira com o celular. Ele
              direciona para uma página oficial que exibe o status atual do
              guarda municipal.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-4"
            className="px-6 border-b border-slate-100"
          >
            <AccordionTrigger className="hover:no-underline py-5 text-slate-700 font-semibold text-left">
              O que acontece ao inativar um guarda no sistema?
            </AccordionTrigger>
            <AccordionContent className="text-slate-500 pb-5 leading-relaxed">
              Ao alterar o status de um guarda para inativo, a carteira física
              perde sua validade digital imediatamente, impedindo qualquer uso
              indevido da identificação funcional, pois ao escanear o QR Code, o
              sistema irá exibir o status "Inativo".
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-6"
            className="px-6 border-b border-slate-100"
          >
            <AccordionTrigger className="hover:no-underline py-5 text-slate-700 font-semibold text-left">
              Como funciona o processamento de impressão em lote?
            </AccordionTrigger>
            <AccordionContent className="text-slate-500 pb-5 leading-relaxed">
              Na página "Impressão em Lote", você seleciona os guardas desejados
              para gerar um arquivo consolidado. O sistema organiza frente e
              verso automaticamente, deixando tudo pronto para a impressão
              física.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-8" className="px-6 border-0">
            <AccordionTrigger className="hover:no-underline py-5 text-slate-700 font-semibold text-left">
              Como exportar o relatório de auditoria?
            </AccordionTrigger>
            <AccordionContent className="text-slate-500 pb-5 leading-relaxed">
              Vá em "Auditoria", utilize a barra de busca para filtrar registros
              específicos (por usuário, ação ou nome do guarda) e clique no
              botão "Exportar para Excel". O sistema vai baixar uma planilha
              estruturada baseada nesses filtros.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
