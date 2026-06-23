"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { ServiceIdentityCard } from "@/components/ServiceIdentityCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Progress } from "@/components/ui/Progress";
import { guardsService } from "@/services/guards.service";
import { settingsService } from "@/services/settings.service";
import type { Guard, SignatureConfig } from "@/lib/types";
import type { GuardData } from "@/components/ServiceIdentityCard";
import { Check, Filter, Printer, Search, Shield, Trash2 } from "lucide-react";
import { toast } from "sonner";
import "@/styles/batch-print.css";

function ExportProgress({ value }: { value: number }) {
  const v = Math.min(100, Math.max(0, value));
  return (
    <div className="mt-2 w-full space-y-1">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] text-slate-400 leading-none">
          {v < 100
            ? "Pode demorar alguns minutos dependendo do tamanho do lote."
            : "Finalizando download..."}
        </span>
        <span className="text-[10px] font-bold tabular-nums text-primary shrink-0">
          {Math.round(v)}%
        </span>
      </div>
      <Progress value={v} className="h-1 bg-slate-100" />
    </div>
  );
}

const BatchPdfProgressDescription = ExportProgress;

const mapGuardToCardData = (
  guard: Guard,
  sig?: SignatureConfig | null,
  origin: string = "",
): GuardData => ({
  name: guard.name,
  registrationNumber: guard.registrationNumber,
  admissionDate: guard.admissionDate,
  role: guard.role,
  rank: guard.rank,
  cardIssuingPlace: guard.cardIssuingPlace,
  cardIssuingDate: guard.cardIssuingDate,
  serial: guard.serial,
  sinarmNumber: guard.sinarmNumber || "",
  expirationDate: guard.expirationDate,
  birthPlace: guard.birthPlace,
  state: guard.state,
  birthDate: guard.birthDate,
  bloodType: guard.bloodType,
  rg: guard.rg,
  cpf: guard.cpf,
  filiation: {
    fatherName: guard.fatherName || "",
    motherName: guard.motherName || "",
  },
  photoUrl: guard.photoUrl,
  qrCodeUrl: `${origin}/validate/${guard.token}`,
  weaponCarryStatus: guard.weaponCarryStatus,
  signatureUrl: sig?.signatureUrl ?? undefined,
  signatureX: sig?.x ?? 270,
  signatureY: sig?.y ?? 290,
  signatureScale: sig?.scale ?? 1.0,
  serverSignatureUrl: guard.signatureUrl ?? undefined,
  serverSignatureX: guard.signatureX,
  serverSignatureY: guard.signatureY,
  serverSignatureScale: guard.signatureScale,
});

export default function BatchPrintContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idsQuery = searchParams.get("ids") || "";
  const idsFromUrl = useMemo(
    () =>
      idsQuery
        ? idsQuery
            .split(",")
            .map((id) => id.trim())
            .filter(Boolean)
        : [],
    [idsQuery],
  );

  const origin = useMemo(
    () => (typeof window !== "undefined" ? window.location.origin : ""),
    [],
  );

  const [guards, setGuards] = useState<Guard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState("all");
  const [rankFilter, setRankFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [validityFilter, setValidityFilter] = useState("all");
  const [weaponFilter, setWeaponFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sigConfig, setSigConfig] = useState<SignatureConfig | null>(null);
  const selectionInitialized = useRef(false);
  const [zoom, setZoom] = useState(1.0);
  const [containerHeight, setContainerHeight] = useState(800);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgressValue, setExportProgressValue] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const [currentPreviewPage, setCurrentPreviewPage] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.3));

  const baseSheetHeight = Math.max(containerHeight - 64, 400);

  const fitScale = baseSheetHeight / 1123;

  const finalContentScale = fitScale * zoom;

  useEffect(() => {
    async function loadGuards() {
      try {
        const result = await guardsService.getAll(
          undefined,
          undefined,
          undefined,
          1,
          5000,
        );
        setGuards(result.data);
      } catch (error) {
        console.error("Failed to load guards", error);
        toast.error("Não foi possível carregar a lista de guardas.");
      } finally {
        setIsLoading(false);
      }
    }
    loadGuards();
  }, []);

  useEffect(() => {
    settingsService
      .getSignature()
      .then(setSigConfig)
      .catch(() => setSigConfig(null));
  }, []);

  useEffect(() => {
    selectionInitialized.current = false;
  }, [idsQuery]);

  useEffect(() => {
    if (isLoading || selectionInitialized.current) return;

    if (idsFromUrl.length > 0) {
      const validIds = idsFromUrl.filter((id) =>
        guards.some((guard) => guard.id === id),
      );
      setSelectedIds(new Set(validIds));
    }

    selectionInitialized.current = true;
  }, [guards, idsFromUrl, isLoading]);

  const filteredGuards = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    thirtyDaysFromNow.setHours(23, 59, 59, 999);

    return guards.filter((guard) => {
      const matchesSearch =
        !query ||
        [guard.name, guard.registrationNumber, guard.cpf]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));

      const matchesRole = roleFilter === "all" || guard.role === roleFilter;
      const matchesRank = rankFilter === "all" || guard.rank === rankFilter;
      const matchesStatus =
        statusFilter === "all" || guard.status === statusFilter;
      const matchesWeapon =
        weaponFilter === "all" || guard.weaponCarryStatus === weaponFilter;

      const isExpiredCard = new Date(guard.expirationDate) < today;
      const isExpiringCard =
        !isExpiredCard &&
        guard.status === "active" &&
        new Date(guard.expirationDate) >= today &&
        new Date(guard.expirationDate) <= thirtyDaysFromNow;

      const matchesValidity =
        validityFilter === "all" ||
        (validityFilter === "expired" && isExpiredCard) ||
        (validityFilter === "expiring" && isExpiringCard) ||
        (validityFilter === "valid" && !isExpiredCard && !isExpiringCard);

      return (
        matchesSearch &&
        matchesRole &&
        matchesRank &&
        matchesStatus &&
        matchesValidity &&
        matchesWeapon
      );
    });
  }, [
    guards,
    searchTerm,
    roleFilter,
    rankFilter,
    statusFilter,
    validityFilter,
    weaponFilter,
  ]);

  const roleOptions = useMemo(
    () => Array.from(new Set(guards.map((guard) => guard.role))).sort(),
    [guards],
  );

  const rankOptions = useMemo(
    () => Array.from(new Set(guards.map((guard) => guard.rank))).sort(),
    [guards],
  );

  const selectedGuards = useMemo(
    () => guards.filter((guard) => selectedIds.has(guard.id)),
    [guards, selectedIds],
  );
  const selectedGuardPages = useMemo(() => {
    const pages: Guard[][] = [];
    const perSheet = 5;
    for (let index = 0; index < selectedGuards.length; index += perSheet) {
      pages.push(selectedGuards.slice(index, index + perSheet));
    }
    return pages;
  }, [selectedGuards]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const sheets = Array.from(
        container.querySelectorAll(".a4-sheet-container"),
      );
      if (sheets.length === 0) return;

      const containerRect = container.getBoundingClientRect();
      const containerTop = containerRect.top;

      let activePage = 1;
      let minDiff = Infinity;

      sheets.forEach((sheet, index) => {
        const rect = sheet.getBoundingClientRect();
        const diff = Math.abs(rect.top - containerTop);
        if (diff < minDiff) {
          minDiff = diff;
          activePage = index + 1;
        }
      });

      setCurrentPreviewPage(activePage);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [selectedGuardPages]);

  const selectedCount = selectedGuards.length;
  const visibleIds = filteredGuards.map((guard) => guard.id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));
  const someVisibleSelected =
    visibleIds.some((id) => selectedIds.has(id)) && !allVisibleSelected;
  const activeFilterCount = [
    roleFilter,
    rankFilter,
    statusFilter,
    validityFilter,
    weaponFilter,
  ].filter((filter) => filter !== "all").length;

  const toggleGuardSelection = (guardId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(guardId)) {
        next.delete(guardId);
      } else {
        next.add(guardId);
      }
      return next;
    });
  };

  const toggleVisibleSelection = (checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      visibleIds.forEach((id) => {
        if (checked) {
          next.add(id);
        } else {
          next.delete(id);
        }
      });
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setRankFilter("all");
    setStatusFilter("all");
    setValidityFilter("all");
    setWeaponFilter("all");
  };

  const [isPrinting, setIsPrinting] = useState(false);

  const handleExportPdf = async () => {
    if (selectedIds.size === 0) return;

    const trackingId = Math.random().toString(36).substring(7);
    setIsExporting(true);
    setExportProgressValue(5);

    const toastId = toast.loading("Gerando PDF do Lote", {
      description: <ExportProgress value={5} />,
    });

    let active = true;

    const progressInterval = setInterval(async () => {
      try {
        const p = await guardsService.getExportProgress(trackingId);
        if (!active) return;
        setExportProgressValue(p);
        
        toast.loading("Gerando PDF do Lote", {
          id: toastId,
          description: <ExportProgress value={p} />,
        });
      } catch (err) {
        console.error("Erro ao buscar progresso:", err);
      }
    }, 1000);

    try {
      const blob = await guardsService.generateBatchPdf(
        Array.from(selectedIds),
        trackingId,
      );

      active = false;
      clearInterval(progressInterval);
      setExportProgressValue(100);
      
      toast.loading("Gerando PDF do Lote", {
        id: toastId,
        description: <ExportProgress value={100} />,
      });

      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.dismiss(toastId);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `lote_carteiras_${new Date().getTime()}.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      setIsExporting(false);
      toast.success("PDF gerado com sucesso!", { duration: 3000 });
    } catch (error) {
      active = false;
      clearInterval(progressInterval);
      setIsExporting(false);
      toast.dismiss(toastId);
      toast.error("Erro ao gerar o PDF.", { duration: 4000 });
    }
  };

  const handlePrint = async () => {
    if (selectedGuards.length === 0) {
      toast.error("Selecione pelo menos um guarda para imprimir.");
      return;
    }

    const trackingId = Math.random().toString(36).substring(7);
    setIsPrinting(true);
    const n = selectedGuards.length;
    const title = `Gerando PDF de ${n} carteira${n === 1 ? "" : "s"}…`;

    const toastId = toast.loading(title, {
      description: <ExportProgress value={5} />,
    });

    let active = true;

    const progressInterval = window.setInterval(async () => {
      try {
        const p = await guardsService.getExportProgress(trackingId);
        if (!active) return;
        
        toast.loading(title, {
          id: toastId,
          description: <ExportProgress value={p} />,
        });
      } catch (err) {
        console.error("Erro ao buscar progresso:", err);
      }
    }, 1000);

    try {
      const blob = await guardsService.generateBatchPdf(
        Array.from(selectedIds),
        trackingId,
      );

      active = false;
      window.clearInterval(progressInterval);
      
      toast.loading(title, {
        id: toastId,
        description: <ExportProgress value={100} />,
      });

      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.dismiss(toastId);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `carteiras_funcionais_lote_${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      link.remove();

      toast.success("PDF gerado com sucesso!", { duration: 3000 });
    } catch (err: unknown) {
      active = false;
      window.clearInterval(progressInterval);
      console.error("Error generating PDF:", err);
      toast.dismiss(toastId);
      toast.error("Erro ao gerar o PDF.", { duration: 4000 });
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="batch-page-root lg:h-[calc(100vh-140px)] flex flex-col space-y-6 overflow-hidden">
      <div className="shrink-0 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1.5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/card">
                  Carteiras
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Impressão em Lote</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-bold text-primary">Impressão em Lote</h1>

          <p className="text-sm text-muted-foreground">
            Selecione vários guardas e revise a montagem do lote (até 5
            carteiras por folha A4, frente e verso lado a lado para dobra à
            direita)
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={clearSelection}
            disabled={selectedCount === 0}
          >
            <Trash2 className="h-4 w-4" />
            Limpar seleção
          </Button>
          <Button onClick={handleExportPdf} disabled={selectedCount === 0}>
            <Printer className="h-4 w-4" />
            Imprimir Lote
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] flex-1 min-h-0">
        <Card className="shadow-sm border-slate-200 overflow-hidden py-4 flex flex-col">
          <CardHeader className="space-y-2 border-b bg-white p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-base font-medium">
                Selecionar Guardas
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleVisibleSelection(!allVisibleSelected)}
                  disabled={filteredGuards.length === 0}
                >
                  {someVisibleSelected && <Check className="h-4 w-4" />}
                  {allVisibleSelected
                    ? "Desmarcar visíveis"
                    : "Selecionar visíveis"}
                </Button>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative min-w-0 flex-1 search-filter-container">
                <Command
                  shouldFilter={false}
                  className="rounded-md border border-slate-300 shadow-sm overflow-visible bg-white h-8 [&_[data-slot=command-input-wrapper]]:border-b-0"
                >
                  <CommandInput
                    placeholder="Buscar por nome, matrícula ou CPF"
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                    onFocus={() => setSearchOpen(true)}
                    onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                    className="h-7 border-none focus:ring-0 placeholder:text-slate-500 text-sm"
                  />
                  {searchOpen && searchTerm.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-md shadow-xl border border-slate-200 z-[100] overflow-hidden">
                      <CommandList className="max-h-[240px] overflow-y-auto custom-scrollbar">
                        <CommandEmpty>Nenhum guarda encontrado</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value="clear-search"
                            onSelect={() => {
                              setSearchTerm("");
                              setSearchOpen(false);
                            }}
                            className="cursor-pointer text-xs text-slate-500"
                          >
                            <Check
                              className={`mr-2 h-3 w-3 ${searchTerm === "" ? "opacity-100" : "opacity-0"}`}
                            />
                            Todos os guardas
                          </CommandItem>
                          {filteredGuards.slice(0, 30).map((guard, index) => (
                            <CommandItem
                              key={`${guard.id}-${index}`}
                              value={`${guard.name} ${guard.registrationNumber} ${index}`}
                              onSelect={() => {
                                setSearchTerm(guard.name);
                                setSearchOpen(false);
                              }}
                              className="cursor-pointer"
                            >
                              <Check
                                className={`mr-2 h-3 w-3 ${
                                  searchTerm === guard.name
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                              />
                              <span className="text-sm font-medium">
                                {guard.name}
                              </span>
                              <span className="ml-auto text-xs text-slate-400">
                                {guard.registrationNumber}
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </div>
                  )}
                </Command>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-between sm:w-32"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filtros
                    </span>
                    {activeFilterCount > 0 ? (
                      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-semibold leading-none tabular-nums text-primary-foreground">
                        {activeFilterCount}
                      </span>
                    ) : (
                      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-semibold leading-none tabular-nums text-primary-foreground">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-3">
                  <div className="grid gap-2">
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger size="sm">
                        <SelectValue placeholder="Função" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as funções</SelectItem>
                        {roleOptions.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={rankFilter} onValueChange={setRankFilter}>
                      <SelectTrigger size="sm">
                        <SelectValue placeholder="Classe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as classes</SelectItem>
                        {rankOptions.map((rank) => (
                          <SelectItem key={rank} value={rank}>
                            {rank}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger size="sm">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os status</SelectItem>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                        <SelectItem value="onLeave">Afastado</SelectItem>
                        <SelectItem value="retired">Aposentado</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={validityFilter}
                      onValueChange={setValidityFilter}
                    >
                      <SelectTrigger size="sm">
                        <SelectValue placeholder="Validade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as validades</SelectItem>
                        <SelectItem value="valid">Válida</SelectItem>
                        <SelectItem value="expiring">Vencendo</SelectItem>
                        <SelectItem value="expired">Vencida</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={weaponFilter}
                      onValueChange={setWeaponFilter}
                    >
                      <SelectTrigger size="sm">
                        <SelectValue placeholder="Porte de arma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os portes</SelectItem>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                        <SelectItem value="expired">Expirado</SelectItem>
                        <SelectItem value="revoked">Revogado</SelectItem>
                        <SelectItem value="suspended">Suspenso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-y-auto flex-1 min-h-0 custom-scrollbar">
            <Table className="w-full border-separate border-spacing-0 min-w-[500px]">
              <TableHeader className="sticky top-0 z-10 bg-slate-50/50">
                <TableRow className="h-9">
                  <TableHead className="w-12 uppercase text-[11px] tracking-wider font-bold text-slate-900 text-center border-b border-slate-100">
                    <Checkbox
                      checked={
                        allVisibleSelected
                          ? true
                          : someVisibleSelected
                            ? "indeterminate"
                            : false
                      }
                      onCheckedChange={(checked) =>
                        toggleVisibleSelection(Boolean(checked))
                      }
                      aria-label="Selecionar todos"
                      className="mx-auto size-[18px] border-slate-300 bg-white shadow-sm hover:border-primary/70 data-[state=checked]:border-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground"
                    />
                  </TableHead>
                  <TableHead className="uppercase text-[11px] tracking-wider font-bold pl-4 text-slate-900 text-left border-b border-slate-100">
                    Nome
                  </TableHead>
                  <TableHead className="w-36 uppercase text-[11px] tracking-wider font-bold text-slate-900 text-center border-b border-slate-100">
                    Matrícula
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow
                      key={`skeleton-${i}`}
                      className="hover:bg-transparent h-11.75"
                    >
                      <TableCell className="py-1 border-b border-slate-100 text-center">
                        <div className="h-4 w-4 rounded-sm bg-slate-100 animate-pulse mx-auto" />
                      </TableCell>
                      <TableCell className="pl-4 py-1 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-md bg-slate-100 animate-pulse shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 bg-slate-100 rounded animate-pulse w-24" />
                            <div className="h-2 bg-slate-50 rounded animate-pulse w-16" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="border-b border-slate-100">
                        <div className="h-3 bg-slate-100 rounded animate-pulse w-20 mx-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredGuards.length === 0 ? (
                  <TableRow className="hover:bg-transparent h-75">
                    <TableCell
                      colSpan={3}
                      className="text-center text-muted-foreground border-b border-slate-100"
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <Shield className="w-12 h-12 text-slate-200 mb-2" />
                        <p className="text-sm font-medium text-slate-400">
                          Nenhum guarda encontrado
                        </p>
                        <p className="text-xs text-slate-400">
                          Ajuste a busca ou volte para selecionar outros
                          guardas.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGuards.map((guard) => (
                    <TableRow
                      key={guard.id}
                      className="hover:bg-slate-50/50 transition-colors h-11.75"
                    >
                      <TableCell className="py-1 border-b border-slate-100 text-center">
                        <Checkbox
                          checked={selectedIds.has(guard.id)}
                          onCheckedChange={() => toggleGuardSelection(guard.id)}
                          aria-label={`Selecionar ${guard.name}`}
                          className="mx-auto size-[18px] border-slate-300 bg-white shadow-sm hover:border-primary/70 data-[state=checked]:border-primary"
                        />
                      </TableCell>
                      <TableCell className="pl-4 py-1 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-white text-xs font-medium shrink-0 shadow-sm shadow-primary/20">
                            {guard.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 text-sm truncate">
                              {guard.name}
                            </div>
                            <div className="text-[10px] text-slate-500 font-medium tracking-wide uppercase truncate mt-0.5">
                              CPF: {guard.cpf}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-sm font-medium text-slate-600 border-b border-slate-100">
                        {guard.registrationNumber}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 overflow-hidden flex flex-col py-0">
          <CardContent
            ref={containerRef}
            className="p-0 bg-slate-200 overflow-hidden flex flex-col h-full max-h-[850px]"
          >
            <header className="flex items-center justify-between h-12 px-4 bg-gradient-to-r from-[#050656] to-[#3E4084] text-white shrink-0 z-20 shadow-md">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="bg-white/10 p-1.5 rounded-md border border-white/10 shadow-inner shrink-0">
                  <Printer className="h-4 w-4 text-white" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <span className="text-[10px] font-bold tracking-tight uppercase text-white leading-none truncate whitespace-nowrap">
                    Pré-visualização do Lote
                  </span>
                  <span className="text-[12px] mt-1 text-white/50 font-medium leading-tight truncate whitespace-nowrap">
                    {selectedGuards.length} carteiras selecionadas
                  </span>
                </div>
              </div>
              <div
                id="batch-header-info"
                className="flex items-center gap-6 shrink-0 ml-4"
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center bg-black/20 px-1 py-1 rounded border border-white/10 shadow-inner w-20">
                    <span className="text-[11px] font-bold text-white leading-none w-7 text-right">
                      {selectedGuards.length > 0 ? currentPreviewPage : 0}
                    </span>
                    <span className="text-white/40 text-[10px] leading-none px-1">
                      /
                    </span>
                    <span className="text-[11px] font-bold text-white/60 leading-none w-7 text-left">
                      {selectedGuardPages.length}
                    </span>
                  </div>
                </div>
                <div className="h-4 w-[1px] bg-white/10" />
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleZoomOut}
                    className="h-7 w-7 flex items-center justify-center hover:bg-white/10 rounded text-white/70 transition-colors"
                    disabled={zoom <= 0.3}
                  >
                    -
                  </button>
                  <div className="bg-black/20 px-3 py-1 rounded border border-white/10 shadow-inner min-w-16 text-center">
                    <span className="text-[11px] font-bold text-white">
                      {Math.round(zoom * 100)}%
                    </span>
                  </div>
                  <button
                    onClick={handleZoomIn}
                    className="h-7 w-7 flex items-center justify-center hover:bg-white/10 rounded text-white/70 transition-colors"
                    disabled={zoom >= 2.0}
                  >
                    +
                  </button>
                </div>
              </div>
            </header>

            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-auto custom-scrollbar-slate flex flex-col h-full"
            >
              {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="mt-4 text-sm text-slate-500 font-medium">
                    Carregando guardas...
                  </p>
                </div>
              ) : selectedGuards.length === 0 ? (
                <div className="flex-1 w-full flex flex-col items-center justify-center text-center text-slate-400 space-y-4">
                  <Printer className="w-16 h-16 opacity-20" />
                  <div className="flex flex-col items-center">
                    <p className="text-lg font-semibold text-slate-500">
                      Nenhuma carteira selecionada
                    </p>
                    <div className="text-sm space-y-1 mt-1">
                      <p>
                        Selecione um ou mais guardas na tabela à esquerda para
                        visualizar a montagem.
                      </p>
                      <p className="font-bold text-slate-300">
                        (5 por folha A4)
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    minWidth: `${794 * finalContentScale + 64}px`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingTop: "0",
                    paddingBottom: "0",
                    gap: "12px",
                  }}
                >
                  {selectedGuardPages.map((pageGuards, pageIndex) => (
                    <div
                      key={`preview-page-${pageIndex}`}
                      className="a4-sheet-container relative shrink-0 shadow-2xl bg-white"
                      style={{
                        width: "794px",
                        height: "1123px",
                        transform: `scale(${finalContentScale})`,
                        transformOrigin: "top center",
                        marginBottom: `${1123 * (finalContentScale - 1)}px`,
                      }}
                    >
                      <div className="batch-preview-sheet h-full w-full">
                        {pageGuards.map((guard) => (
                          <div
                            key={`preview-card-${guard.id}`}
                            className="batch-card-slot"
                          >
                            <ServiceIdentityCard
                              data={mapGuardToCardData(
                                guard,
                                sigConfig,
                                origin,
                              )}
                              scale={0.55}
                              qrCodeColorOverride="#1e3a5f"
                              printLayout="batch"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx global>{`
        @media (max-width: 1224px) {
          #batch-header-info {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
