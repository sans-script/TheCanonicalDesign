"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { auditService, AuditLog } from "@/services/audit.service";
import { Loader2, Download, Search } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn, formatDate } from "@/lib/utils";
import * as XLSX from "xlsx";

const colWidths = [
  "w-[18%]", 
  "w-[20%]", 
  "w-[12%]", 
  "w-[50%]", 
];

const entityLabels: Record<string, string> = {
  guard: "Guarda Municipal",
  guardcertificate: "Certificado",
  guardequipment: "Equipamento",
  psychologicalevaluation: "Avaliação Psicológica",
  user: "Usuário",
  securitythrottle: "Segurança",
};

const actionLabels: Record<string, string> = {
  CREATE: "CADASTRO",
  UPDATE: "EDIÇÃO",
  DELETE: "REMOÇÃO",
  LOGIN_SUCCESS: "LOGIN",
  LOGIN_FAILED: "FALHA",
  LOGIN_THROTTLE_WARNING: "AVISO",
  LOGIN_STRIKE: "AVISO",
  LOGIN_BANNED: "BLOQUEIO",
};

const actionPhrases: Record<string, string> = {
  CREATE: "Cadastro de",
  UPDATE: "Edição de",
  DELETE: "Remoção de",
  LOGIN_THROTTLE_WARNING: "Aviso de segurança no login",
  LOGIN_STRIKE: "Nova ocorrência de login",
  LOGIN_BANNED: "Bloqueio de login",
};

const getAuditEntityLabel = (entity: string) =>
  entityLabels[entity.toLowerCase()] || entity;

const getAuditActionLabel = (action: string) =>
  actionLabels[action] || action;

const getAuditActionPhrase = (action: string) =>
  actionPhrases[action] || getAuditActionLabel(action);

const getAuditTargetDescription = (log: AuditLog) => {
  const data = log.newData || log.oldData;

  if (!data) {
    return "";
  }

  if (log.entity.toLowerCase() === "securitythrottle") {
    const attempts = typeof data.strikes === "number" ? data.strikes : 0;
    const reason = data.reason || "Limite de tentativas de login atingido";
    const expiresAt = data.expiresAt ? formatDate(data.expiresAt) : "";

    if (log.action === "LOGIN_THROTTLE_WARNING") {
      return `${reason}${attempts > 0 ? ` (${attempts} tentativa${attempts === 1 ? "" : "s"})` : ""}`;
    }

    if (log.action === "LOGIN_STRIKE") {
      return `${reason}${expiresAt ? ` até ${expiresAt}` : ""}`;
    }

    if (log.action === "LOGIN_BANNED") {
      return `${reason}${attempts > 0 ? ` (${attempts} tentativa${attempts === 1 ? "" : "s"})` : ""}`;
    }

    return reason;
  }

  const name = data.name || "";
  const guardName = data.guardName || "";
  const registrationNumber = data.registrationNumber || "";
  const date = data.evaluationDate ? formatDate(data.evaluationDate) : "";

  if (log.entity.toLowerCase() === "guard") {
    return `${name}${registrationNumber ? ` (Mat ${registrationNumber})` : ""}`;
  }

  const itemLabel =
    name || (log.entity.toLowerCase() === "psychologicalevaluation" ? "Laudo" : "Item");
  const dateLabel = date ? ` (${date})` : "";
  const ownerLabel = guardName ? ` do Guarda ${guardName}` : "";
  return `${itemLabel}${dateLabel}${ownerLabel}`;
};

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadLogs() {
      try {
        const data = await auditService.getAll();
        setLogs(data);
      } catch (error) {
        console.error("Failed to load audit logs", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadLogs();
  }, []);

  const getActionStyles = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-emerald-100/80 text-emerald-700 ring-1 ring-emerald-200/50";
      case "UPDATE":
        return "bg-blue-100/80 text-blue-700 ring-1 ring-blue-200/50";
      case "DELETE":
        return "bg-rose-100/80 text-rose-700 ring-1 ring-rose-200/50";
      case "LOGIN_SUCCESS":
        return "bg-indigo-100/80 text-indigo-700 ring-1 ring-indigo-200/50";
      case "LOGIN_FAILED":
        return "bg-amber-100/80 text-amber-700 ring-1 ring-amber-200/50";
      case "LOGIN_THROTTLE_WARNING":
        return "bg-amber-100/80 text-amber-700 ring-1 ring-amber-200/50";
      case "LOGIN_STRIKE":
        return "bg-orange-100/80 text-orange-700 ring-1 ring-orange-200/50";
      case "LOGIN_BANNED":
        return "bg-rose-100/80 text-rose-700 ring-1 ring-rose-200/50";
      default:
        return "bg-slate-100/80 text-slate-700 ring-1 ring-slate-200/50";
    }
  };

  const getFriendlyDetails = (log: AuditLog) => {
    if (log.action === "LOGIN_SUCCESS") {
      return (
        <div className="flex items-center gap-1.5 whitespace-nowrap overflow-hidden">
          <span className="text-xs font-bold text-slate-700 truncate">
            Acesso ao sistema realizado com sucesso
          </span>
        </div>
      );
    }

    // Special rendering for security throttle events to avoid duplicated labels
    if (log.entity.toLowerCase() === "securitythrottle") {
      const actionName = getAuditActionPhrase(log.action);
      const targetName = getAuditTargetDescription(log);
      return (
        <div className="flex items-center gap-1.5 whitespace-nowrap overflow-hidden">
          <span className="text-xs font-bold text-slate-700 truncate">
            {actionName}{targetName ? `: ${targetName}` : ""}
          </span>
        </div>
      );
    }

    if (log.action === "LOGIN_FAILED") {
      return (
        <div className="flex items-center gap-1.5 whitespace-nowrap overflow-hidden">
          <span className="text-xs font-bold text-amber-700 truncate">
            Tentativa de acesso não autorizada
          </span>
        </div>
      );
    }

    const entityName = getAuditEntityLabel(log.entity);
    const actionName = getAuditActionPhrase(log.action);
    const targetName = getAuditTargetDescription(log);

    return (
      <div className="flex items-center gap-1.5 whitespace-nowrap overflow-hidden">
        <span className="text-xs font-bold text-slate-700 truncate">
          {actionName} {entityName}
          {targetName ? `: ${targetName}` : ""}
        </span>
      </div>
    );
  };

  const downloadExcel = () => {
    const headers = [
      "Data",
      "Hora",
      "Usuário",
      "Ação",
      "Entidade",
      "Descrição",
    ];
    const rows = logs.map((log) => {
      return [
        new Date(log.createdAt).toLocaleDateString("pt-BR"),
        new Date(log.createdAt).toLocaleTimeString("pt-BR"),
        log.user?.name || log.userId || "Sistema",
        getAuditActionLabel(log.action),
        getAuditEntityLabel(log.entity),
        getAuditTargetDescription(log),
      ];
    });

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const colWidths = [
      { wch: 12 },
      { wch: 10 },
      { wch: 25 },
      { wch: 12 },
      { wch: 15 },
      { wch: 40 },
    ];
    worksheet["!cols"] = colWidths;
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Auditoria");
    XLSX.writeFile(
      workbook,
      `audit_logs_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.userId &&
        log.userId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.user?.name &&
        log.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.oldData?.name &&
        log.oldData.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.newData?.name &&
        log.newData.name.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="lg:h-[calc(100vh-140px)] flex flex-col space-y-6 overflow-hidden">
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Auditoria</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            Logs de Auditoria
          </h1>
          <p className="text-muted-foreground text-sm">
            Rastreabilidade de ações e segurança do sistema
          </p>
        </div>
        <Button
          onClick={downloadExcel}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar para Excel
        </Button>
      </div>

      <div className="shrink-0 flex gap-4 items-end">
        <div className="flex-1 max-w-md space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Filtrar registros
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
            <label htmlFor="auditSearch" className="sr-only">Filtrar registros</label>
            <Input
              id="auditSearch"
              placeholder="Buscar por usuário, ação, entidade ou nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              maxLength={100}
              className="pl-10 h-10 border-slate-300"
            />
          </div>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200 overflow-hidden flex-1 flex flex-col min-h-0">
        <CardHeader className="bg-white pt-4 pb-2 shrink-0">
          <CardTitle className="text-primary text-base">
            Registros Recentes ({filteredLogs.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden flex-1 flex flex-col min-h-0">
          <div className="w-full overflow-x-auto flex-1 flex flex-col min-h-0">
            <div className="h-[506px] lg:h-auto lg:flex-1 overflow-y-auto min-h-0">
              <Table className="table-fixed min-w-[900px] w-full border-separate border-spacing-0">
              <TableHeader className="sticky top-0 z-10 bg-slate-50/50">
                <TableRow className="h-9">
                  <TableHead className={cn(colWidths[0], "uppercase text-[11px] tracking-wider font-bold pl-6 text-slate-900 text-center border-b border-slate-100")}>Data / Hora</TableHead>
                  <TableHead className={cn(colWidths[1], "uppercase text-[11px] tracking-wider font-bold text-slate-900 text-center border-b border-slate-100")}>Usuário</TableHead>
                  <TableHead className={cn(colWidths[2], "uppercase text-[11px] tracking-wider font-bold text-slate-900 text-center border-b border-slate-100")}>Ação</TableHead>
                  <TableHead className={cn(colWidths[3], "uppercase text-[11px] tracking-wider font-bold pr-6 text-slate-900 text-center border-b border-slate-100")}>Descrição da Atividade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={`skeleton-${i}`} className="hover:bg-transparent h-[47px]">
                      <TableCell className="pl-6 py-1 border-b border-slate-100">
                        <div className="h-3 bg-slate-100 rounded animate-pulse w-24" />
                      </TableCell>
                      <TableCell className="border-b border-slate-100"><div className="h-3 bg-slate-100 rounded animate-pulse w-32" /></TableCell>
                      <TableCell className="border-b border-slate-100"><div className="h-5 bg-slate-100 rounded-full animate-pulse w-20" /></TableCell>
                      <TableCell className="pr-6 border-b border-slate-100"><div className="h-3 bg-slate-100 rounded animate-pulse w-64" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  <>
                    {filteredLogs.length === 0 ? (
                      <TableRow className="hover:bg-transparent h-[470px]">
                        <TableCell colSpan={4} className="text-center text-muted-foreground border-b border-slate-100">
                          <div className="flex flex-col items-center justify-center h-full">
                            <Search className="w-12 h-12 text-slate-200 mb-2" />
                            <p className="text-sm font-medium text-slate-400">Nenhum registro encontrado</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {filteredLogs.map((log) => (
                          <TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors h-[47px]">
                            <TableCell className={cn(colWidths[0], "pl-6 py-1 border-b border-slate-100")}>
                              <span className="text-[11px] font-bold text-slate-700">
                                {new Date(log.createdAt).toLocaleDateString("pt-BR")}{" "}
                                às{" "}
                                {new Date(log.createdAt).toLocaleTimeString("pt-BR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </TableCell>
                            <TableCell className={cn(colWidths[1], "py-1 border-b border-slate-100 text-center")}>
                              <span className="text-[12px] font-bold text-slate-700 truncate block">
                                {log.user?.name || log.userId || "Sistema"}
                              </span>
                            </TableCell>
                            <TableCell className={cn(colWidths[2], "py-1 border-b border-slate-100 text-center")}>
                              <div
                                className={cn(
                                  "inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider leading-none",
                                  getActionStyles(log.action),
                                )}
                              >
                                {getAuditActionLabel(log.action)}
                              </div>
                            </TableCell>
                            <TableCell className={cn(colWidths[3], "pr-6 py-1 border-b border-slate-100")}>
                              {getFriendlyDetails(log)}
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredLogs.length < 10 &&
                          Array.from({ length: 10 - filteredLogs.length }).map((_, i) => (
                            <TableRow key={`empty-${i}`} className="h-[47px] hover:bg-transparent">
                              <TableCell colSpan={4} className="border-b border-transparent" />
                            </TableRow>
                          ))}
                      </>
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      </Card>
    </div>
  );
}
