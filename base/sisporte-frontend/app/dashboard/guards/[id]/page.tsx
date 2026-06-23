"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Loader2,
  Shield,
  ShieldCheck,
  Award,
  Package,
  Calendar as CalendarIcon,
  FileText,
  Edit,
  CreditCard,
  User,
} from "lucide-react";
import { IoHandLeftOutline } from "react-icons/io5";
import { guardsService } from "@/services/guards.service";
import { toast } from "sonner";
import { cn, formatDate, isExpired } from "@/lib/utils";
import type { Guard } from "@/lib/types";
import { AuthenticatedImage } from "@/components/AuthenticatedImage";
import { handleViewDocument } from "@/lib/document-utils";

export default function GuardDetailsPage() {
  const { id } = useParams() as { id: string };
  const [guard, setGuard] = useState<Guard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadGuard() {
      try {
        const data = await guardsService.getById(id);
        setGuard(data);
      } catch (error) {
        console.error("Failed to load guard", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadGuard();
  }, [id]);

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#050656] mb-4" />
        <p className="text-sm font-bold text-[#050656] tracking-[0.2em] uppercase opacity-50">
          Buscando detalhes...
        </p>
      </div>
    );
  }

  if (!guard) {
    notFound();
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-240/50",
      inactive: "bg-rose-100 text-rose-700 ring-1 ring-rose-240/50",
      onLeave: "bg-amber-100 text-amber-700 ring-1 ring-amber-240/50",
      retired: "bg-blue-100 text-blue-700 ring-1 ring-blue-240/50",
    };
    const label: Record<string, string> = {
      active: "Ativo",
      inactive: "Inativo",
      onLeave: "Afastado",
      retired: "Aposentado",
    };
    return (
      <span
        className={cn(
          "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
          styles[status],
        )}
      >
        {label[status]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/guards">
                  Guardas
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Detalhes do Guarda</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-bold text-primary">{guard.name}</h1>
          <p className="text-muted-foreground text-sm">
            Matrícula: {guard.registrationNumber}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild className="border-slate-300">
            <Link href={`/dashboard/guards/${id}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Editar Dados
            </Link>
          </Button>
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            <Link href={`/dashboard/card?id=${id}`}>
              <CreditCard className="w-4 h-4 mr-2" />
              Ver Carteira
            </Link>
          </Button>
          <Button variant="outline" asChild className="border-slate-300">
            <Link href={`/validate/${guard.token}`} target="_blank">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Validação
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {}
        <Card className="shadow-sm border-slate-240 flex flex-col h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-primary text-lg flex items-center gap-2">
              <User className="w-5 h-5" />
              Perfil e Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 flex flex-col justify-between pt-0">
            <div className="flex items-start gap-6 pb-2">
              <div className="flex flex-col items-center">
                <div className="relative w-[108px] h-[144px] rounded-lg overflow-hidden bg-white shadow-sm border border-slate-200">
                  <AuthenticatedImage
                    src={guard.photoUrl || "/placeholder.png"}
                    alt={guard.name}
                    fill
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Função
                    </span>
                    <span className="font-semibold text-slate-800">
                      {guard.role}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Status
                    </span>
                    <div className="pt-0.5">{getStatusBadge(guard.status)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Matrícula
                    </span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {guard.registrationNumber}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Classe
                    </span>
                    <span className="font-semibold text-slate-800 uppercase">
                      {guard.rank}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Observações
              </span>
              <div className="text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-md p-3 min-h-16 max-h-32 overflow-y-auto italic leading-relaxed custom-scrollbar whitespace-pre-wrap break-words">
                {guard.notes || "Nenhuma observação registrada."}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Admissão
                </span>
                <span className="text-sm font-bold text-slate-700">
                  {formatDate(guard.admissionDate)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Cadastrado em
                </span>
                <span className="text-sm font-bold text-slate-700">
                  {new Date(guard.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Validade do Porte
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-700">
                    {formatDate(guard.expirationDate)}
                  </span>
                  {isExpired(guard.expirationDate) && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-tight bg-rose-500 text-white shadow-sm shadow-rose-500/20">
                      VENCIDA
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Porte de Arma
                </span>
                <span
                  className={cn(
                    "text-sm font-bold uppercase",
                    guard.weaponCarryStatus === "active"
                      ? "text-emerald-600"
                      : "text-rose-600",
                  )}
                >
                  {guard.weaponCarryStatus === "active" ? "Ativo" : "Inativo"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {}
        <Card className="lg:col-span-2 shadow-sm border-slate-240 flex flex-col h-full">
          <CardHeader>
            <CardTitle className="text-primary text-lg flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <dl className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1">
                <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Nome Completo
                </dt>
                <dd className="font-semibold text-slate-800">{guard.name}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  CPF
                </dt>
                <dd className="font-semibold text-slate-800">{guard.cpf}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  RG
                </dt>
                <dd className="font-semibold text-slate-800">{guard.rg}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Data de Nascimento
                </dt>
                <dd className="font-semibold text-slate-800">
                  {formatDate(guard.birthDate)}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Naturalidade
                </dt>
                <dd className="font-semibold text-slate-800">
                  {guard.birthPlace} - {guard.state}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Tipo Sanguíneo
                </dt>
                <dd className="font-semibold text-slate-800">
                  {guard.bloodType}
                </dd>
              </div>
              <div className="sm:col-span-2 space-y-1">
                <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Filiação
                </dt>
                <dd className="font-semibold text-slate-800 flex flex-col gap-0.5">
                  <span>{guard.motherName || "Mãe não informada"}</span>
                  <span>{guard.fatherName || "Pai não informado"}</span>
                </dd>
              </div>
              {/* <div className="space-y-1">
                <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Contato de Emergência
                </dt>
                <dd className="font-semibold text-slate-800">
                  {guard.emergencyContact || "Não informado"}
                </dd>
              </div> */}
              <div className="space-y-1">
                <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Coturno
                </dt>
                <dd className="font-semibold text-slate-800">
                  {guard.bootSize || "-"}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Gandola
                </dt>
                <dd className="font-semibold text-slate-800">
                  {guard.shirtSize || "-"}
                </dd>
              </div>
              <div className="sm:col-span-2 space-y-1">
                <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Endereço
                </dt>
                <dd className="font-semibold text-slate-800">
                  {guard.address || "Não informado"}
                  {guard.cep && `, ${guard.cep}`}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-sm border-slate-240 flex flex-col h-full rounded-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-primary text-base flex items-center gap-2">
              <Award className="w-4 h-4" />
              Certificados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 flex-1 flex flex-col justify-start overflow-hidden pt-0 px-4 pb-4">
            <div className="overflow-y-auto pr-1 space-y-2 max-h-56 scrollbar-thin scrollbar-thumb-slate-240 scrollbar-track-transparent">
              {guard.certificates && guard.certificates.length > 0 ? (
                guard.certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className={cn(
                      "group flex justify-between items-start p-2.5 min-h-27.5 rounded-md border border-slate-200 bg-white shadow-sm transition-all",
                      cert.documentUrl
                        ? "cursor-pointer hover:border-primary/50 hover:bg-slate-50"
                        : "hover:border-slate-300",
                    )}
                    onClick={() => {
                      if (cert.documentUrl) {
                        handleViewDocument(cert.documentUrl);
                      }
                    }}
                  >
                    <div className="min-w-0 flex-1 flex flex-col justify-between self-stretch">
                      <div className="space-y-1">
                        <p className="text-[13px] font-bold text-slate-900 uppercase truncate pr-6">
                          {cert.name}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium uppercase mt-0.5">
                          {cert.institution} • {formatDate(cert.date)}
                        </p>
                        {(cert.startDate || cert.expiryDate) && (
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-[11px] text-slate-400 font-medium uppercase">
                              {cert.startDate && `Início: ${formatDate(cert.startDate)}`}
                              {cert.startDate && cert.expiryDate && " • "}
                              {cert.expiryDate && `Validade: ${formatDate(cert.expiryDate)}`}
                            </p>
                            {isExpired(cert.expiryDate) && (
                              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-tight bg-rose-500 text-white shadow-sm shadow-rose-500/20">
                                VENCIDO
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      {cert.documentUrl && (
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary pt-2 leading-none">
                          <FileText className="w-4 h-4 translate-y-[0.5px]" />
                          <span className="mt-0.5">VER DOCUMENTO</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-2">
                  Nenhum certificado registrado
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-240 flex flex-col h-full rounded-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-primary text-base flex items-center gap-2">
              <Package className="w-4 h-4" />
              Equipamentos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 flex-1 flex flex-col justify-start overflow-hidden pt-0 px-4 pb-4">
            <div className="overflow-y-auto pr-1 space-y-2 max-h-56 scrollbar-thin scrollbar-thumb-slate-240 scrollbar-track-transparent">
              {guard.equipments && guard.equipments.length > 0 ? (
                guard.equipments.map((equip) => (
                  <div
                    key={equip.id}
                    className="group flex justify-between items-start p-2.5 min-h-27.5 rounded-md border border-slate-200 bg-white shadow-sm hover:border-primary/50 hover:bg-slate-50 transition-all"
                  >
                    <div className="min-w-0 flex-1 flex flex-col justify-between self-stretch">
                      <div className="space-y-1">
                        <p className="text-[13px] font-bold text-slate-900 uppercase truncate pr-6">
                          {equip.name}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium uppercase mt-0.5">
                          {equip.type}
                          {equip.serialNumber
                            ? ` • S/N: ${equip.serialNumber}`
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-2">
                  Nenhum equipamento vinculado
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-240 flex flex-col h-full rounded-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-primary text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Laudos Psicológicos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 flex-1 flex flex-col justify-start overflow-hidden pt-0 px-4 pb-4">
            <div className="overflow-y-auto pr-1 space-y-2 max-h-56 scrollbar-thin scrollbar-thumb-slate-240 scrollbar-track-transparent">
              {guard.psychologicalEvaluations &&
              guard.psychologicalEvaluations.length > 0 ? (
                guard.psychologicalEvaluations.map((evaluation) => (
                  <div
                    key={evaluation.id}
                    className={cn(
                      "group flex justify-between items-start p-2.5 min-h-27.5 rounded-md border border-slate-200 bg-white shadow-sm transition-all",
                      evaluation.documentUrl
                        ? "cursor-pointer hover:border-primary/50 hover:bg-slate-50"
                        : "hover:border-slate-300",
                    )}
                    onClick={() => {
                      if (evaluation.documentUrl) {
                        handleViewDocument(evaluation.documentUrl);
                      }
                    }}
                  >
                    <div className="min-w-0 flex-1 flex flex-col justify-between self-stretch">
                      <div className="space-y-1">
                        <p className="text-[13px] font-bold text-slate-900 uppercase truncate pr-6">
                          {evaluation.title || `Laudo de ${formatDate(evaluation.evaluationDate)}`}
                        </p>
                        <div className="flex flex-col gap-1 mt-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-tight",
                                evaluation.status === "fit"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-rose-100 text-rose-700",
                              )}
                            >
                              {evaluation.status === "fit" ? "Apto" : "Inapto"}
                            </span>
                            {isExpired(evaluation.expirationDate) && (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-tight bg-rose-500 text-white shadow-sm shadow-rose-500/20">
                                VENCIDO
                              </span>
                            )}
                            {evaluation.expirationDate && (
                              <p className="text-[11px] text-slate-400 font-medium uppercase">
                                Validade: {formatDate(evaluation.expirationDate)}
                              </p>
                            )}
                          </div>
                          {evaluation.evaluatorInfo && (
                            <p className="text-[11px] text-slate-500 font-medium uppercase truncate">
                              {evaluation.evaluatorInfo}
                            </p>
                          )}
                        </div>
                      </div>
                      {evaluation.documentUrl && (
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary pt-2 leading-none">
                          <FileText className="w-4 h-4 translate-y-[0.5px]" />
                          <span className="mt-0.5">VER LAUDO</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-2">
                  Nenhum laudo registrado
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
