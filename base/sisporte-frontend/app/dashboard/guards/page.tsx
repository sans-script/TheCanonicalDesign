"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command";
import { cn, formatDate } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  CreditCard,
  Trash2,
  Loader2,
  Printer,
  Check,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Shield,
  Info,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { guardsService } from "@/services/guards.service";
import { toast } from "sonner";
import type { Guard } from "@/lib/types";

const colWidths = [
  "w-[40px]",
  "w-[280px]",
  "w-[100px]",
  "w-[160px]",
  "w-[120px]",
  "w-[110px]",
  "w-[100px]",
  "w-[130px]",
  "w-[160px]",
];

const STATUS_FILTERS = [
  "todos",
  "active",
  "inactive",
  "onLeave",
  "retired",
] as const;
const CARD_FILTERS = [
  "todos",
  "expiring",
  "expired",
  "weaponActive",
  "weaponInactive",
] as const;

const isStatusFilter = (
  value: string | null,
): value is (typeof STATUS_FILTERS)[number] =>
  !!value && STATUS_FILTERS.includes(value as (typeof STATUS_FILTERS)[number]);

const isCardFilter = (
  value: string | null,
): value is (typeof CARD_FILTERS)[number] =>
  !!value && CARD_FILTERS.includes(value as (typeof CARD_FILTERS)[number]);

function GuardsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const legacyFilterParam = searchParams.get("filter");
  const statusParam = searchParams.get("status");
  const cardParam = searchParams.get("cardFilter");

  const [guards, setGuards] = useState<Guard[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [cardFilter, setCardFilter] = useState<string>("todos");
  const [statusOpen, setStatusOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [guardToDelete, setGuardToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    async function loadGuards() {
      setIsLoading(true);
      try {
        const result = await guardsService.getAll(
          statusFilter === "todos" ? undefined : statusFilter,
          cardFilter === "todos" ? undefined : cardFilter,
          debouncedSearch || undefined,
          currentPage,
          10,
        );
        setGuards(result.data);
        setPagination({
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
        });
      } catch (error) {
        console.error("Failed to load guards", error);
        toast.error("Erro ao carregar a lista de guardas.");
      } finally {
        setIsLoading(false);
      }
    }
    loadGuards();
  }, [statusFilter, cardFilter, debouncedSearch, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, cardFilter, debouncedSearch]);

  useEffect(() => {
    if (isStatusFilter(statusParam)) {
      setStatusFilter(statusParam);
    }
  }, [statusParam]);

  useEffect(() => {
    if (isCardFilter(cardParam)) {
      setCardFilter(cardParam);
    }
  }, [cardParam]);

  useEffect(() => {
    if (legacyFilterParam) {
      if (isStatusFilter(legacyFilterParam)) {
        setStatusFilter(legacyFilterParam);
      } else if (legacyFilterParam === "expiring") {
        setCardFilter("expiring");
      }
    }
  }, [legacyFilterParam]);

  const openDeleteDialog = (id: string, name: string) => {
    setGuardToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!guardToDelete) return;
    if (!deletePassword) {
      toast.error("Por favor, insira sua senha para confirmar.");
      return;
    }

    try {
      await guardsService.delete(guardToDelete.id, deletePassword);
      setGuards((prev) => prev.filter((g) => g.id !== guardToDelete.id));
      toast.success(`Guarda ${guardToDelete.name} removido com sucesso.`);
      setDeleteDialogOpen(false);
      setGuardToDelete(null);
      setDeletePassword("");
    } catch (error: any) {
      console.error("Failed to delete guard", error);
      const message =
        error.response?.data?.message ||
        "Erro ao excluir o guarda. Tente novamente.";
      toast.error(message);
    }
  };

  const filteredGuards = guards;

  const getStatusBadge = (status: Guard["status"]) => {
    const styles = {
      active: "bg-emerald-100/80 text-emerald-700 ring-1 ring-emerald-200/50",
      inactive: "bg-rose-100/80 text-rose-700 ring-1 ring-rose-200/50",
      onLeave: "bg-amber-100/80 text-amber-700 ring-1 ring-amber-200/50",
      retired: "bg-blue-100/80 text-blue-700 ring-1 ring-blue-200/50",
    };
    const label = {
      active: "Ativo",
      inactive: "Inativo",
      onLeave: "Afastado",
      retired: "Aposentado",
    };
    return (
      <div
        className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider leading-none ${styles[status]}`}
      >
        {label[status]}
      </div>
    );
  };

  const getWeaponCarryBadge = (status: Guard["weaponCarryStatus"]) => {
    const styles = {
      active: "bg-emerald-100/80 text-emerald-700 ring-1 ring-emerald-200/50",
      inactive: "bg-rose-100/80 text-rose-700 ring-1 ring-rose-200/50",
      expired: "bg-amber-100/80 text-amber-700 ring-1 ring-amber-200/50",
      revoked: "bg-slate-100/80 text-slate-700 ring-1 ring-slate-200/50",
      suspended: "bg-orange-100/80 text-orange-700 ring-1 ring-orange-200/50",
    };
    const label = {
      active: "Ativo",
      inactive: "Inativo",
      expired: "Expirado",
      revoked: "Revogado",
      suspended: "Suspenso",
    };
    return (
      <div
        className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider leading-none ${styles[status] ?? styles.inactive}`}
      >
        {label[status] ?? label.inactive}
      </div>
    );
  };

  if (isLoading && guards.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-[10px] font-bold text-primary tracking-[0.3em] uppercase opacity-40">
          Buscando Registros
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {}
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Guardas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-bold text-primary">Gestão de Guardas</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie o cadastro e documentos dos guardas municipais
          </p>
        </div>
        <Link href="/dashboard/guards/add" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Novo Cadastro
          </Button>
        </Link>
      </div>

      {}
      <div className="shrink-0 flex flex-col sm:flex-row gap-4 relative z-50 items-end">
        <div className="flex-1 w-full flex flex-col gap-2 search-filter-container">
          <label className="text-sm font-semibold text-slate-700">
            Pesquisar guardas
          </label>
          <div className="relative w-full search-filter-container">
            <Command
              shouldFilter={false}
              className="rounded-md border border-slate-300 shadow-sm overflow-visible bg-white h-10 [&_[data-slot=command-input-wrapper]]:border-b-0"
            >
              <CommandInput
                placeholder="Pesquise por nome, matrícula, CPF, certificados ou equipamentos..."
                value={searchTerm}
                onValueChange={setSearchTerm}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                className="h-9 border-none focus:ring-0 flex-1 placeholder:text-slate-500 text-sm w-full"
              />
              {searchOpen && searchTerm.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-md shadow-xl border border-slate-200 z-[100] overflow-hidden">
                  <CommandList className="max-h-[300px] overflow-y-auto custom-scrollbar">
                    <CommandEmpty>Nenhum guarda encontrado</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="all-guards"
                        onSelect={() => {
                          setSearchTerm("");
                          setSearchOpen(false);
                        }}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            searchTerm === "" ? "opacity-100" : "opacity-0",
                          )}
                        />
                        Todos os Guardas
                      </CommandItem>
                      {guards.map((guard, index) => (
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
                            className={cn(
                              "mr-2 h-4 w-4",
                              searchTerm === guard.name
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {guard.name} - Mat: {guard.registrationNumber}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </div>
              )}
            </Command>
          </div>
        </div>

        <div className="w-full sm:w-64 flex flex-col gap-2 status-filter-container">
          <label className="text-sm font-semibold text-slate-700">
            Filtrar por Status
          </label>
          <Popover open={statusOpen} onOpenChange={setStatusOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={statusOpen}
                className="w-full justify-between bg-white text-left font-normal border-slate-300 h-10"
              >
                <span className="truncate flex-1">
                  {statusFilter === "todos" && "Todos os Status"}
                  {statusFilter === "active" && "Ativos"}
                  {statusFilter === "inactive" && "Inativos"}
                  {statusFilter === "onLeave" && "Afastados"}
                  {statusFilter === "retired" && "Aposentados"}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] p-0 status-popover-content"
              align="start"
              onInteractOutside={(e) => {
                const target = e.target as Element | null;
                if (
                  target?.closest?.(".search-filter-container") ||
                  target?.closest?.(".guard-popover-content")
                ) {
                  e.preventDefault();
                }
              }}
            >
              <Command>
                <CommandList>
                  <CommandGroup>
                    {[
                      { value: "todos", label: "Todos os Status" },
                      { value: "active", label: "Ativos" },
                      { value: "inactive", label: "Inativos" },
                      { value: "onLeave", label: "Afastados" },
                      { value: "retired", label: "Aposentados" },
                    ].map((status) => (
                      <CommandItem
                        key={status.value}
                        value={status.value}
                        onSelect={() => {
                          setStatusFilter(status.value);
                          setStatusOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            statusFilter === status.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {status.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="w-full sm:w-72 flex flex-col gap-2 card-filter-container">
          <label className="text-sm font-semibold text-slate-700">
            Filtrar por Carteira
          </label>
          <Popover open={cardOpen} onOpenChange={setCardOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={cardOpen}
                className="w-full justify-between bg-white text-left font-normal border-slate-300 h-10"
              >
                <span className="truncate flex-1">
                  {cardFilter === "todos" && "Todas as Carteiras"}
                  {cardFilter === "expiring" && "Vencendo"}
                  {cardFilter === "expired" && "Vencida"}
                  {cardFilter === "weaponActive" && "Porte de Arma Ativo"}
                  {cardFilter === "weaponInactive" && "Porte de Arma Inativo"}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] p-0 card-popover-content"
              align="start"
              onInteractOutside={(e) => {
                const target = e.target as Element | null;
                if (
                  target?.closest?.(".search-filter-container") ||
                  target?.closest?.(".status-popover-content")
                ) {
                  e.preventDefault();
                }
              }}
            >
              <Command>
                <CommandList>
                  <CommandGroup>
                    {[
                      { value: "todos", label: "Todas as Carteiras" },
                      { value: "expiring", label: "Vencendo" },
                      { value: "expired", label: "Vencida" },
                      { value: "weaponActive", label: "Porte de Arma Ativo" },
                      {
                        value: "weaponInactive",
                        label: "Porte de Arma Inativo",
                      },
                    ].map((card) => (
                      <CommandItem
                        key={card.value}
                        value={card.value}
                        onSelect={() => {
                          setCardFilter(card.value);
                          setCardOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            cardFilter === card.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {card.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>



      {}
      <Card className="shadow-sm border-slate-200 overflow-hidden py-2">
        <CardHeader className="bg-white pt-4 pb-2">
          <CardTitle className="text-primary text-base">
            Guardas Municipais ({pagination.total})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto custom-scrollbar">
          <Table className="w-full min-w-[1200px] border-separate border-spacing-0">
            <TableHeader className="sticky top-0 z-10 bg-slate-50/50">
              <TableRow className="h-9">

                <TableHead
                  className={cn(
                    colWidths[1],
                    "uppercase text-[11px] tracking-wider font-bold pl-4 text-slate-900 text-center border-b border-slate-100",
                  )}
                >
                  Nome
                </TableHead>
                <TableHead
                  className={cn(
                    colWidths[2],
                    "uppercase text-[11px] tracking-wider font-bold text-slate-900 text-center border-b border-slate-100",
                  )}
                >
                  Matrícula
                </TableHead>
                <TableHead
                  className={cn(
                    colWidths[3],
                    "uppercase text-[11px] tracking-wider font-bold text-slate-900 text-center border-b border-slate-100",
                  )}
                >
                  Função
                </TableHead>
                <TableHead
                  className={cn(
                    colWidths[4],
                    "uppercase text-[11px] tracking-wider font-bold text-slate-900 text-center border-b border-slate-100",
                  )}
                >
                  Classe
                </TableHead>
                <TableHead
                  className={cn(
                    colWidths[5],
                    "uppercase text-[11px] tracking-wider font-bold text-slate-900 text-center border-b border-slate-100",
                  )}
                >
                  Status
                </TableHead>
                <TableHead
                  className={cn(
                    colWidths[6],
                    "uppercase text-[11px] tracking-wider font-bold text-slate-900 text-center border-b border-slate-100",
                  )}
                >
                  Validade
                </TableHead>
                <TableHead
                  className={cn(
                    colWidths[7],
                    "uppercase text-[11px] tracking-wider font-bold text-slate-900 text-center border-b border-slate-100",
                  )}
                >
                  Porte de Arma
                </TableHead>
                <TableHead
                  className={cn(
                    colWidths[8],
                    "uppercase text-[11px] tracking-wider font-bold pr-6 text-slate-900 text-center border-b border-slate-100",
                  )}
                >
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow className="hover:bg-transparent h-[470px]">
                  <TableCell
                    colSpan={8}
                    className="text-center border-b border-slate-100"
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20 mb-4" />
                      <p className="text-[10px] font-bold text-primary tracking-[0.3em] uppercase opacity-40">
                        Buscando Guardas...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredGuards.length === 0 ? (
                <TableRow className="hover:bg-transparent h-[470px]">
                  <TableCell
                    colSpan={8}
                    className="text-center text-muted-foreground border-b border-slate-100"
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <Shield className="w-12 h-12 text-slate-200 mb-2" />
                      <p className="text-sm font-medium text-slate-400">
                        Nenhum guarda encontrado
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {filteredGuards.map((guard) => (
                    <TableRow
                      key={guard.id}
                      className="hover:bg-slate-50/50 transition-colors h-[47px]"
                    >

                      <TableCell
                        className={cn(
                          colWidths[1],
                          "pl-4 py-1 border-b border-slate-100",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-white text-xs font-medium shrink-0 shadow-sm shadow-primary/20">
                            {guard.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 text-sm truncate">
                              {guard.name}
                            </div>
                            <div className="text-[10px] text-slate-500 font-medium leading-none">
                              {guard.cpf}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell
                        className={cn(
                          colWidths[2],
                          "font-mono text-[13px] py-1 border-b border-slate-100 text-center text-slate-600",
                        )}
                      >
                        {guard.registrationNumber}
                      </TableCell>
                      <TableCell
                        className={cn(
                          colWidths[3],
                          "text-[13px] py-1 border-b border-slate-100 text-center text-slate-600 uppercase font-medium",
                        )}
                      >
                        {guard.role}
                      </TableCell>
                      <TableCell
                        className={cn(
                          colWidths[4],
                          "font-bold text-slate-900 text-[13px] py-1 border-b border-slate-100 text-center",
                        )}
                      >
                        {guard.rank}
                      </TableCell>
                      <TableCell
                        className={cn(
                          colWidths[5],
                          "py-1 border-b border-slate-100 text-center",
                        )}
                      >
                        {getStatusBadge(guard.status)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          colWidths[6],
                          "text-[13px] font-medium py-1 border-b border-slate-100 text-center text-slate-600",
                        )}
                      >
                        {formatDate(guard.expirationDate)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          colWidths[7],
                          "py-1 border-b border-slate-100 text-center",
                        )}
                      >
                        {getWeaponCarryBadge(guard.weaponCarryStatus)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          colWidths[8],
                          "pr-6 py-1 border-b border-slate-100 text-center",
                        )}
                      >
                        <TooltipProvider>
                          <div className="flex items-center justify-center gap-0.5">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-slate-400 hover:text-primary transition-colors"
                                  onClick={() =>
                                    router.push(`/dashboard/guards/${guard.id}`)
                                  }
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Visualizar detalhes
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-slate-400 hover:text-primary transition-colors"
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/guards/${guard.id}/edit`,
                                    )
                                  }
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Editar cadastro</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-slate-400 hover:text-primary transition-colors"
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/card?id=${guard.id}&print=true`,
                                    )
                                  }
                                >
                                  <Printer className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Imprimir Funcional
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-slate-400 hover:text-rose-600 transition-colors"
                                  onClick={() =>
                                    openDeleteDialog(guard.id, guard.name)
                                  }
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Excluir guarda</TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredGuards.length < 10 &&
                    Array.from({ length: 10 - filteredGuards.length }).map(
                      (_, i) => (
                        <TableRow
                          key={`empty-${i}`}
                          className="h-[47px] hover:bg-transparent"
                        >
                          <TableCell
                            colSpan={9}
                            className="border-b border-transparent"
                          />
                        </TableRow>
                      ),
                    )}
                </>
              )}
            </TableBody>
          </Table>

          {}
          <div className="shrink-0 px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="text-xs text-slate-500 font-medium">
              Mostrando{" "}
              <span className="text-slate-900">
                {(pagination.page - 1) * 10 + 1}
              </span>{" "}
              a{" "}
              <span className="text-slate-900">
                {Math.min(pagination.page * 10, pagination.total)}
              </span>{" "}
              de <span className="text-slate-900">{pagination.total}</span>{" "}
              resultados
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-md border-slate-200"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1 mx-2">
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    let pageNum: number;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "ghost"}
                        size="sm"
                        className={cn(
                          "h-8 w-8 p-0 text-xs font-bold rounded-md",
                          currentPage === pageNum
                            ? "bg-primary text-white"
                            : "text-slate-600 hover:bg-slate-100",
                        )}
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={isLoading}
                      >
                        {pageNum}
                      </Button>
                    );
                  },
                )}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-md border-slate-200"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(pagination.totalPages, prev + 1),
                  )
                }
                disabled={currentPage === pagination.totalPages || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setDeletePassword("");
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-800">
              Confirmar exclusão
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              Tem certeza que deseja excluir o guarda{" "}
              <span className="font-bold text-slate-700">
                {guardToDelete?.name}
              </span>
              ? Esta ação não pode ser desfeita e removerá todos os dados do
              servidor.
            </AlertDialogDescription>
            <div className="py-3">
              <label className="text-xs font-bold text-slate-600 mb-1.5 block uppercase tracking-wider">
                Confirmação de Segurança
              </label>
              <Input
                type="password"
                placeholder="Insira sua senha para confirmar..."
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="border-slate-200 focus:border-rose-500 focus:ring-rose-500"
                autoFocus
              />
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-200 text-slate-500">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20"
            >
              Excluir definitivamente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function GuardsPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[70vh] flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-[10px] font-bold text-primary tracking-[0.3em] uppercase opacity-40">
            Carregando...
          </p>
        </div>
      }
    >
      <GuardsList />
    </Suspense>
  );
}
