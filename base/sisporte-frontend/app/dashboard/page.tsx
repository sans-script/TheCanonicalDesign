"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Clock,
  AlertTriangle,
  Shield,
  CreditCard,
  Plus,
  X,
  Printer,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  UserMinus,
} from "lucide-react";
import { IoHandLeft } from "react-icons/io5";
import { guardsService } from "@/services/guards.service";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/Breadcrumb";
import type { Guard, DashboardStats } from "@/lib/types";
import { cn } from "@/lib/utils";

type ActionId =
  | "dashboard"
  | "guards"
  | "guards-add"
  | "card"
  | "batch-print"
  | "help";

interface AppAction {
  id: ActionId;
  label: string;
  description: string;
  href: string;
  icon: React.ElementType;
  primary?: boolean;
}

const ALL_ACTIONS: AppAction[] = [
  {
    id: "guards",
    label: "Listar Guardas",
    description: "Consulte todos os guardas cadastrados no sistema",
    href: "/dashboard/guards",
    icon: Users,
  },
  {
    id: "guards-add",
    label: "Novo Cadastro",
    description: "Registre um novo guarda municipal no sistema",
    href: "/dashboard/guards/add",
    icon: UserPlus,
    primary: true,
  },
  {
    id: "card",
    label: "Ver Carteira",
    description: "Consulte e visualize carteiras funcionais",
    href: "/dashboard/card",
    icon: CreditCard,
  },
  {
    id: "batch-print",
    label: "Impressão em Lote",
    description: "Selecione vários guardas e imprima as carteiras de uma vez",
    href: "/dashboard/card/batch",
    icon: Printer,
  },
  {
    id: "help",
    label: "Ajuda",
    description: "Precisa de ajuda? Clique aqui.",
    href: "/dashboard/help",
    icon: HelpCircle,
  },
];

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
      className={`inline-flex items-center justify-center px-1.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider leading-none ${styles[status]}`}
    >
      {label[status]}
    </div>
  );
};

const CAROUSEL_INTERVAL = 8000;
const SLIDE_COUNT = 2;
const SWIPE_THRESHOLD = 60;

function CarouselCard({ recentGuards }: { recentGuards: Guard[] }) {
  const [pos, setPos] = useState(0);
  const [animate, setAnimate] = useState(true);
  const paused = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dragStart = useRef<number | null>(null);
  const [dragDelta, setDragDelta] = useState(0);

  const realSlide = pos % SLIDE_COUNT;
  const advance = useCallback(() => {
    setAnimate(true);
    setPos((p) => p + 1);
  }, []);

  useEffect(() => {
    if (pos === SLIDE_COUNT) {
      const t = setTimeout(() => {
        setAnimate(false);
        setPos(0);
      }, 520);
      return () => clearTimeout(t);
    }
  }, [pos]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (!paused.current) advance();
    }, CAROUSEL_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [advance]);

  const goTo = (i: number) => {
    setAnimate(true);
    setPos(i);
  };

  const onDragStart = (x: number) => {
    dragStart.current = x;
  };
  const onDragMove = (x: number) => {
    if (dragStart.current === null) return;
    setDragDelta(x - dragStart.current);
  };
  const onDragEnd = () => {
    if (dragStart.current === null) return;
    if (dragDelta < -SWIPE_THRESHOLD) {
      advance();
    } else if (dragDelta > SWIPE_THRESHOLD && pos > 0) {
      setAnimate(true);
      setPos((p) => p - 1);
    }
    dragStart.current = null;
    setDragDelta(0);
  };

  const offset =
    -(pos * 100) + (dragStart.current !== null ? dragDelta / 4 : 0);

  return (
    <Card
      className="flex flex-col h-full min-h-[400px] overflow-hidden"
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
    >
      <div
        className="relative flex-1 min-h-0 overflow-hidden cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => onDragStart(e.clientX)}
        onPointerMove={(e) => onDragMove(e.clientX)}
        onPointerUp={onDragEnd}
        onPointerCancel={onDragEnd}
      >
        <div
          className={cn(
            "flex h-full",
            animate && "transition-transform duration-500 ease-in-out",
          )}
          style={{ transform: `translateX(${offset}%)` }}
        >
          <SlideAcoes />
          <SlideCadastros recentGuards={recentGuards} />
          <SlideAcoes />
        </div>
      </div>

      <div className="shrink-0 flex items-center justify-center gap-3 py-2">
        <button
          onClick={() => {
            setAnimate(true);
            setPos((p) => (p > 0 ? p - 1 : SLIDE_COUNT - 1));
          }}
          className="h-6 w-6 flex items-center justify-center rounded-full text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {["Ações", "Cadastros"].map((label, i) => (
          <button
            key={label}
            onClick={() => goTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              realSlide === i
                ? "w-6 bg-primary"
                : "w-1.5 bg-slate-200 hover:bg-slate-300",
            )}
            aria-label={label}
          />
        ))}
        <button
          onClick={advance}
          className="h-6 w-6 flex items-center justify-center rounded-full text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
          aria-label="Próximo"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}

function SlideAcoes() {
  return (
    <div className="w-full shrink-0 flex flex-col h-full gap-4">
      <CardHeader className="shrink-0">
        <CardTitle className="text-base font-medium">Ações Rápidas</CardTitle>
        <CardDescription className="text-sm">
          Acesse as principais funcionalidades
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {ALL_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <div key={action.id} className="relative group">
                <Link
                  href={action.href}
                  className={cn(
                    "relative flex flex-col justify-between rounded-md p-3 aspect-square overflow-hidden transition-all hover:shadow-md border group-hover:-translate-y-0.5",
                    action.primary
                      ? "bg-gradient-to-r from-[#050656] to-[#3E4084] text-white hover:opacity-95 border-0 shadow-sm"
                      : "bg-white text-slate-900 hover:bg-slate-50 border-slate-200",
                  )}
                >
                  <div className="space-y-0.5 z-10 relative">
                    <div
                      className={cn(
                        "text-sm sm:text-base font-bold leading-tight",
                        !action.primary && "text-[#050656]",
                      )}
                    >
                      {action.label}
                    </div>
                    <div
                      className={cn(
                        "text-[10px] sm:text-xs leading-snug opacity-70",
                        action.primary ? "text-white" : "text-slate-500",
                      )}
                    >
                      {action.description}
                    </div>
                  </div>
                  <Icon
                    className={cn(
                      "absolute bottom-2 right-2 w-6 h-6 sm:w-8 sm:h-8 transition-transform duration-300 group-hover:scale-110",
                      action.primary
                        ? "opacity-30"
                        : "opacity-10 text-[#050656]",
                    )}
                    strokeWidth={1.5}
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </CardContent>
    </div>
  );
}

function SlideCadastros({ recentGuards }: { recentGuards: Guard[] }) {
  return (
    <div className="w-full shrink-0 flex flex-col h-full gap-4">
      <CardHeader className="shrink-0">
        <CardTitle className="text-base font-medium">
          Últimos Cadastros
        </CardTitle>
        <CardDescription className="text-sm">
          Guardas adicionados recentemente
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between px-3 pb-2 mb-2 border-b text-xs font-semibold text-muted-foreground">
          <div>Nome</div>
          <div className="flex items-center gap-3">
            <div className="w-23.75 text-center">Porte de Arma</div>
            <div className="w-20 text-center">Status</div>
          </div>
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto pr-1 custom-scrollbar">
          {recentGuards.map((guarda) => (
            <Link
              key={guarda.id}
              href={`/dashboard/guards/${guarda.id}`}
              className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                  {guarda.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                    {guarda.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Mat: {guarda.registrationNumber}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-23.75 whitespace-nowrap inline-flex items-center justify-center px-1.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider leading-none ${
                    guarda.weaponCarryStatus === "active"
                      ? "bg-emerald-100/80 text-emerald-700 ring-1 ring-emerald-200/50"
                      : "bg-slate-100/80 text-slate-500 ring-1 ring-slate-200/50"
                  }`}
                >
                  {guarda.weaponCarryStatus === "active"
                    ? "Porte Ativo"
                    : "Porte Inativo"}
                </div>
                <div className="w-20 flex justify-center">
                  {getStatusBadge(guarda.status)}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Link
          href="/dashboard/guards"
          className="shrink-0 block text-center text-primary text-sm font-medium mt-4 hover:underline"
        >
          Ver todos os guardas
        </Link>
      </CardContent>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentGuards, setRecentGuards] = useState<Guard[]>([]);
  const [expiredGuards, setExpiredGuards] = useState<Guard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, guardsData, expiredData] = await Promise.all([
          guardsService.getStats(),
          guardsService.getAll(),
          guardsService.getAll(undefined, "expired", undefined, 1, 5),
        ]);
        setStats(statsData);
        setRecentGuards(guardsData.data.slice(0, 5));
        setExpiredGuards(expiredData.data);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading || !stats) {
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
    <div className="flex-1 flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Visão geral do Sistema de Identificação de Carteiras Funcionais da
            Guarda Municipal
          </p>
        </div>

        <div className="flex flex-col items-start justify-center min-w-0 sm:min-w-[260px]">
          <div className="flex items-baseline gap-2 leading-none">
            <span className="text-[38px] font-bold tracking-tight text-primary leading-none">
              {isLoading ? "..." : stats.totalGuards}
            </span>
            <span className="text-sm font-medium uppercase tracking-wide text-slate-600">
              {isLoading
                ? "GUARDAS"
                : stats.totalGuards === 1
                  ? "GUARDA"
                  : "GUARDAS"}
            </span>
          </div>
          <span className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {isLoading
              ? "Cadastrados no sistema até o momento"
              : stats.totalGuards === 1
                ? "Cadastrado no sistema até o momento"
                : "Cadastrados no sistema até o momento"}
          </span>
        </div>
      </div>

      <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 items-start">
        <Link href="/dashboard/guards?filter=active" className="block group">
          <Card className="shadow-sm border-slate-200/60 group-hover:shadow-md transition-all cursor-pointer group-hover:border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Ativos
              </CardTitle>
              <Shield className="h-4 w-4 text-emerald-600 opacity-20 group-hover:opacity-40 transition-opacity" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {isLoading ? "..." : stats.active}
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/guards?filter=inactive" className="block group">
          <Card className="shadow-sm border-slate-200/60 group-hover:shadow-md transition-all cursor-pointer group-hover:border-rose-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Inativos
              </CardTitle>
              <Shield className="h-4 w-4 text-rose-600 opacity-20 group-hover:opacity-40 transition-opacity" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-600">
                {isLoading ? "..." : stats.inactive}
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/guards?filter=onLeave" className="block group">
          <Card className="shadow-sm border-slate-200/60 group-hover:shadow-md transition-all cursor-pointer group-hover:border-amber-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Afastados
              </CardTitle>
              <UserMinus className="h-4 w-4 text-amber-600 opacity-20 group-hover:opacity-40 transition-opacity" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {isLoading ? "..." : stats.onLeave}
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/guards?filter=retired" className="block group">
          <Card className="shadow-sm border-slate-200/60 group-hover:shadow-md transition-all cursor-pointer group-hover:border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Aposentados
              </CardTitle>
              <Shield className="h-4 w-4 text-blue-600 opacity-20 group-hover:opacity-40 transition-opacity" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {isLoading ? "..." : stats.retired}
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/guards?filter=expiring" className="block group">
          <Card className="shadow-sm border-slate-200/60 group-hover:shadow-md transition-all cursor-pointer group-hover:border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Portes Vencendo
              </CardTitle>
              <CreditCard className="h-4 w-4 text-orange-600 opacity-20 group-hover:opacity-40 transition-opacity" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {isLoading ? "..." : stats.expiringCards}
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link
          href="/dashboard/guards?cardFilter=expired"
          className="block group"
        >
          <Card className="shadow-sm border-slate-200/60 group-hover:shadow-md transition-all cursor-pointer group-hover:border-rose-300">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Portes Vencidos
              </CardTitle>
              <CreditCard className="h-4 w-4 text-rose-600 opacity-20 group-hover:opacity-40 transition-opacity" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-600">
                {isLoading ? "..." : stats.expiredCards}
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="flex-1 min-h-0 flex flex-col gap-6 pb-6">
        <div className="grid gap-6 lg:grid-cols-2 flex-1 min-h-[max(400px,calc(100vh-350px))]">
          <CarouselCard recentGuards={recentGuards} />
          <Card className="flex flex-col h-full gap-4 overflow-hidden border-rose-200/70">
            <CardHeader className="shrink-0">
              <CardTitle className="text-base font-medium text-rose-700">
                Portes Vencidos
              </CardTitle>
              <CardDescription className="text-sm">
                Portes já expirados no sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between px-3 pb-2 mb-2 border-b text-xs font-semibold text-muted-foreground">
                <div>Nome</div>
                <div className="w-27.5 text-center">Vencimento</div>
              </div>

              <div className="flex-1 space-y-1 overflow-y-auto pr-1 custom-scrollbar">
                {expiredGuards.length === 0 ? (
                  <div className="flex h-full min-h-30 items-center justify-center rounded-md border border-dashed border-rose-200 bg-rose-50/50 text-sm text-rose-600">
                    Nenhum porte vencido no momento.
                  </div>
                ) : (
                  expiredGuards.map((guard) => (
                    <Link
                      key={guard.id}
                      href={`/dashboard/guards/${guard.id}`}
                      className="flex items-center justify-between p-3 rounded-md hover:bg-rose-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded bg-rose-600 flex items-center justify-center text-white text-sm font-medium shrink-0">
                          {guard.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-sm text-foreground group-hover:text-rose-700 transition-colors truncate">
                            {guard.name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            Mat: {guard.registrationNumber}
                          </div>
                        </div>
                      </div>
                      <div className="w-27.5 text-center text-xs font-semibold text-rose-700">
                        {new Date(guard.expirationDate).toLocaleDateString(
                          "pt-BR",
                        )}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
