"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
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
import { ServiceIdentityCard } from "@/components/ServiceIdentityCard";
import { guardsService } from "@/services/guards.service";
import { settingsService } from "@/services/settings.service";
import type { Guard } from "@/lib/types";
import type { SignatureConfig } from "@/lib/types";
import {
  Printer,
  Download,
  Check,
  ChevronsUpDown,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { GuardData } from "@/components/ServiceIdentityCard";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";

const mapGuardToCardData = (
  guard: Guard,
  sig?: SignatureConfig | null,
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
  qrCodeUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/validate/${guard.token}`,
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

function ServiceIdentityCardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idFromUrl = searchParams.get("id") || searchParams.get("guardId");
  const idsQuery = searchParams.get("ids") || "";
  const idsFromUrl = idsQuery
    ? idsQuery
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
    : [];
  const isBatchMode = idsFromUrl.length > 0;

  const [guards, setGuards] = useState<Guard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string>(idFromUrl || "");
  const [guardData, setGuardData] = useState<GuardData | null>(null);
  const [guardDataList, setGuardDataList] = useState<GuardData[]>([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("nome-asc");

  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [cardScale, setCardScale] = useState(1);
  const [cardScreenLayout, setCardScreenLayout] = useState<"row" | "column">(
    "row",
  );
  const [sigConfig, setSigConfig] = useState<SignatureConfig | null>(null);

  const updateUrl = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set("id", id);
    } else {
      params.delete("id");
    }
    router.replace(`/dashboard/card?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const el = cardContainerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const available = Math.max(entry.contentRect.width, 0);
      const rowWidth = 540 * 2 + 32;
      const columnWidth = 540;
      const safetyMargin = 40;
      const nextLayout = available < rowWidth + safetyMargin ? "column" : "row";
      const baseWidth = nextLayout === "column" ? columnWidth : rowWidth;
      const nextScale = Math.min(
        Math.max(available / (baseWidth + safetyMargin), 0.3),
        1,
      );

      setCardScreenLayout(nextLayout);
      setCardScale(nextScale);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [guardsRes, sigRes] = await Promise.all([
          guardsService.getAll(undefined, undefined, undefined, 1, 5000),
          settingsService.getSignature().catch(() => null),
        ]);
        setGuards(guardsRes.data);
        setSigConfig(sigRes);
      } catch (error) {
        console.error("Failed to load initial data", error);
        toast.error("Erro ao carregar dados do sistema.");
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const sortedGuards = [...guards].sort((a, b) => {
    if (sortBy === "nome-asc") return a.name.localeCompare(b.name);
    if (sortBy === "nome-desc") return b.name.localeCompare(a.name);
    if (sortBy === "matricula-asc")
      return a.registrationNumber.localeCompare(b.registrationNumber);
    if (sortBy === "matricula-desc")
      return b.registrationNumber.localeCompare(a.registrationNumber);
    return 0;
  });

  useEffect(() => {
    const shouldPrint = searchParams.get("print") === "true";
    const hasPrintableContent = isBatchMode
      ? guardDataList.length > 0
      : !!guardData;

    if (shouldPrint && hasPrintableContent && !isLoading) {
      const timer = setTimeout(() => {
        const oldTitle = document.title;
        if (!isBatchMode && guardData) {
          document.title = `CARTEIRA DE IDENTIFICAÇÃO FUNCIONAL - ${guardData.name.toUpperCase()}`;
        }

        window.print();

        if (!isBatchMode && guardData) {
          document.title = oldTitle;
        }

        const params = new URLSearchParams(searchParams.toString());
        params.delete("print");
        router.replace(`/dashboard/card?${params.toString()}`, {
          scroll: false,
        });
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [searchParams, guardData, guardDataList, isLoading, router, isBatchMode]);

  useEffect(() => {
    async function fetchSelectedGuard() {
      if (isBatchMode) {
        try {
          const cards = await Promise.all(
            idsFromUrl.map(async (id) => {
              const guard = await guardsService.getById(id);
              return mapGuardToCardData(guard, sigConfig);
            }),
          );
          setGuardDataList(cards);
        } catch (error) {
          console.error("Failed to fetch selected guards", error);
          setGuardDataList([]);
        }
        return;
      }

      if (selectedId) {
        try {
          const guard = await guardsService.getById(selectedId);
          if (guard) {
            setGuardData(mapGuardToCardData(guard, sigConfig));
          }
        } catch (error) {
          console.error("Failed to fetch selected guard", error);
          setGuardData(null);
        }
      } else {
        setGuardData(null);
        setGuardDataList([]);
      }
    }
    fetchSelectedGuard();
  }, [selectedId, idsQuery, isBatchMode, sigConfig]);

  const handlePrint = () => {
    const oldTitle = document.title;
    if (!isBatchMode && guardData) {
      document.title = `CARTEIRA DE IDENTIFICAÇÃO FUNCIONAL - ${guardData.name.toUpperCase()}`;
    }
    window.print();
    if (!isBatchMode && guardData) {
      setTimeout(() => {
        document.title = oldTitle;
      }, 500);
    }
  };

  const handleExportPdf = () => {
    toast("Exportando para PDF", {
      description:
        "Para gerar o arquivo, certifique-se de escolher 'Salvar como PDF' no destino de impressão.",
      duration: 4000,
    });

    const oldTitle = document.title;
    if (!isBatchMode && guardData) {
      document.title = `CARTEIRA DE IDENTIFICAÇÃO FUNCIONAL - ${guardData.name.toUpperCase()}`;
    }

    setTimeout(() => {
      window.print();
      if (!isBatchMode && guardData) {
        setTimeout(() => {
          document.title = oldTitle;
        }, 500);
      }
    }, 1000);
  };

  const cardsToRender = isBatchMode
    ? guardDataList
    : guardData
      ? [guardData]
      : [];

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
                <BreadcrumbLink href="/dashboard/guards">
                  Guardas
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Carteira Funcional</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-bold text-primary">
            {isBatchMode ? "Impressão em Lote" : "Carteira Funcional"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isBatchMode
              ? `${cardsToRender.length} carteira${cardsToRender.length === 1 ? "" : "s"} selecionada${cardsToRender.length === 1 ? "" : "s"} para impressão`
              : "Selecione um guarda para emitir ou visualizar a carteira"}
          </p>
        </div>
        {cardsToRender.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <Button onClick={handleExportPdf}>
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        )}
      </div>

      {!isBatchMode && (
        <div className="shrink-0 flex flex-col sm:flex-row gap-4 relative z-50 items-end">
          <div className="flex-1 w-full flex flex-col gap-2 search-filter-container">
            <label className="text-sm font-semibold text-slate-700">
              Selecionar Guarda
            </label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between bg-white text-left font-normal border-slate-300 h-10"
                >
                  <span className="truncate flex-1">
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Carregando...
                      </div>
                    ) : selectedId ? (
                      guards.find((g) => g.id === selectedId)?.name
                    ) : (
                      "Busque pelo nome ou matrícula..."
                    )}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Procurar guarda..."
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                  />
                  <CommandList className="max-h-[400px]">
                    <CommandEmpty>Nenhum guarda encontrado</CommandEmpty>
                    <CommandGroup>
                      {sortedGuards
                        .filter((g) => {
                          if (!searchTerm) return true;
                          const s = searchTerm.toLowerCase();
                          return (
                            g.name.toLowerCase().includes(s) ||
                            g.registrationNumber.toLowerCase().includes(s)
                          );
                        })
                        .map((g) => (
                          <CommandItem
                            key={g.id}
                            onSelect={() => {
                              setSelectedId(g.id);
                              updateUrl(g.id);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedId === g.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {g.name} - Mat: {g.registrationNumber}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="w-full sm:w-64 flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">
              Ordenar por
            </label>
            <Popover open={sortOpen} onOpenChange={setSortOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between bg-white font-normal h-10"
                >
                  <span className="truncate">
                    {sortBy === "nome-asc" && "Nome (A - Z)"}
                    {sortBy === "nome-desc" && "Nome (Z - A)"}
                    {sortBy === "matricula-asc" && "Matrícula (Crescente)"}
                    {sortBy === "matricula-desc" && "Matrícula (Decrescente)"}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                  <CommandList>
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          setSortBy("nome-asc");
                          setSortOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            sortBy === "nome-asc" ? "opacity-100" : "opacity-0",
                          )}
                        />{" "}
                        Nome (A - Z)
                      </CommandItem>
                      <CommandItem
                        onSelect={() => {
                          setSortBy("nome-desc");
                          setSortOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            sortBy === "nome-desc"
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />{" "}
                        Nome (Z - A)
                      </CommandItem>
                      <CommandItem
                        onSelect={() => {
                          setSortBy("matricula-asc");
                          setSortOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            sortBy === "matricula-asc"
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />{" "}
                        Matrícula (Crescente)
                      </CommandItem>
                      <CommandItem
                        onSelect={() => {
                          setSortBy("matricula-desc");
                          setSortOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            sortBy === "matricula-desc"
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />{" "}
                        Matrícula (Decrescente)
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      <Card className="overflow-hidden p-0 border-slate-200 shadow-sm flex-1 flex flex-col min-h-0">
        <CardHeader
          className={cn(
            "h-[56px] shrink-0 flex flex-row items-center px-4 py-0 border-b-0 space-y-0",
            cardsToRender.length > 0
              ? "bg-gradient-to-r from-[#050656] to-[#3E4084]"
              : "bg-muted",
          )}
        >
          <CardTitle
            className={cn(
              "text-base leading-none translate-y-[1px]",
              cardsToRender.length > 0 ? "text-white" : "text-muted-foreground",
            )}
          >
            {cardsToRender.length > 1
              ? "Carteiras para Impressão"
              : cardsToRender.length === 1
                ? "Carteira de Identificação Funcional"
                : "Pré-visualização"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-[#f0f4f8] flex-1 overflow-y-auto min-h-0">
          <div ref={cardContainerRef} className="w-full min-h-full flex flex-col justify-center">
            {cardsToRender.length > 0 ? (
              <div className="print-area flex flex-col items-center gap-8">
                {cardsToRender.map((data, idx) => (
                  <div
                    key={`${data.registrationNumber}-${idx}`}
                    className="w-full flex justify-center"
                  >
                    <ServiceIdentityCard
                      data={data}
                      scale={isBatchMode ? 1 : cardScale}
                      screenLayout={isBatchMode ? "row" : cardScreenLayout}
                      printLayout={isBatchMode ? "batch" : "single"}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center opacity-40 grayscale pointer-events-none">
                <ServiceIdentityCard
                  data={{
                    name: "NOME DO GUARDA",
                    registrationNumber: "00.000-0",
                    admissionDate: "01/01/2000",
                    role: "GUARDA MUNICIPAL",
                    rank: "CLASSE",
                    cardIssuingPlace: "São Luís",
                    cardIssuingDate: "01/01/2024",
                    serial: "000000",
                    sinarmNumber: "000000",
                    expirationDate: "01/01/2029",
                    birthPlace: "São Luís",
                    state: "MA",
                    birthDate: "01/01/1980",
                    bloodType: "O+",
                    rg: "0000000000-0",
                    cpf: "000.000.000-00",
                    qrCodeUrl: "",
                  }}
                  scale={cardScale}
                  screenLayout={cardScreenLayout}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden;
          }
          .print-area,
          .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
            padding-top: 3mm !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function CarteiraPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
          <p className="mt-4 text-[10px] font-bold text-primary tracking-[0.3em] uppercase opacity-40">
            Carregando Visualizador
          </p>
        </div>
      }
    >
      <ServiceIdentityCardContent />
    </Suspense>
  );
}
