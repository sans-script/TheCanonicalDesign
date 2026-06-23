"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CreditCard,
  Printer,
  LogOut,
  Shield,
  PlusCircle,
  LifeBuoy,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Settings,
  PenTool,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/Separator";
import { authService } from "@/services/auth.service";

const mainItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Guardas",
    href: "/dashboard/guards",
    icon: Shield,
    match: "prefix",
    exclude: ["/dashboard/guards/add"],
  },
  {
    title: "Novo Cadastro",
    href: "/dashboard/guards/add",
    icon: PlusCircle,
  },
  {
    title: "Visualizar Carteira",
    href: "/dashboard/card",
    icon: CreditCard,
  },
  {
    title: "Impressão em Lote",
    href: "/dashboard/card/batch",
    icon: Printer,
    match: "prefix",
  },
  {
    title: "Assinaturas",
    href: "/dashboard/settings/signature",
    icon: PenTool,
    adminOnly: true,
  },
];

const systemItems = [
  {
    title: "Usuários",
    href: "/dashboard/users",
    icon: Users,
    adminOnly: true,
  },
  {
    title: "Auditoria",
    href: "/dashboard/audit",
    icon: ClipboardList,
    adminOnly: true,
  },
];

const helpItems = [
  {
    title: "Ajuda",
    href: "/dashboard/help",
    icon: LifeBuoy,
  },
];

interface AppSidebarProps {
  className?: string;
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export function AppSidebar({
  className,
  isCollapsed,
  toggleSidebar,
}: AppSidebarProps) {
  const pathname = usePathname();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    authService.logout();
  };

  const isExpanded = !isCollapsed;

  const isActive = (href: string, match?: string, exclude?: string[]) => {
    if (
      exclude &&
      exclude.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`),
      )
    ) {
      return false;
    }
    if (match === "prefix") {
      return pathname === href || pathname.startsWith(`${href}/`);
    }
    return pathname === href;
  };

  const renderMenuItem = (item: any) => {
    if (item.adminOnly && user?.role !== "ADMIN") return null;

    const active = isActive(item.href, item.match, item.exclude);

    const link = (
      <Link
        key={item.href}
        href={item.href}
        className="relative flex items-center h-11 w-full group"
      >
        {active && (
          <div
            className={cn(
              "absolute top-0.5 bottom-0.5 bg-primary/10 transition-all duration-300 ease-in-out z-0 rounded-md",
              isExpanded ? "left-4 right-3" : "left-4 w-10",
            )}
          />
        )}
        <div className="w-[72px] shrink-0 flex items-center justify-center z-10">
          <item.icon
            className={cn(
              "h-[18px] w-[18px] transition-colors duration-200",
              active
                ? "text-primary"
                : "text-muted-foreground group-hover:text-primary",
            )}
            strokeWidth={1.5}
          />
        </div>
        <div
          className={cn(
            "flex-1 flex items-center overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out pr-4 z-10",
            "opacity-100 translate-x-0",
            !isExpanded &&
              "lg:opacity-0 lg:-translate-x-4 lg:pointer-events-none",
          )}
        >
          <span
            className={cn(
              "text-sm transition-colors truncate",
              active
                ? "text-primary font-medium"
                : "text-muted-foreground group-hover:text-primary",
            )}
          >
            {item.title}
          </span>
        </div>
      </Link>
    );

    if (!isExpanded) {
      return (
        <Tooltip key={item.href} delayDuration={0}>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent
            side="right"
            sideOffset={12}
          >
            {item.title}
          </TooltipContent>
        </Tooltip>
      );
    }

    return link;
  };

  return (
    <aside
      className={cn(
        "relative flex flex-col bg-card border-r border-border shrink-0 z-40 transition-all duration-300 ease-in-out",
        "hidden lg:flex", 
        "w-72 min-w-72 lg:w-[72px] lg:min-w-[72px]",
        isExpanded && "lg:w-72 lg:min-w-72",
        className,
      )}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (window.innerWidth >= 1024) {
            toggleSidebar();
          }
        }}
        className={cn(
          "absolute -right-3 top-[20px] h-6 w-6 rounded-full border border-border bg-card flex items-center justify-center z-50 shadow-sm hover:bg-accent transition-all duration-300 hidden xl:flex",
          !isExpanded && "rotate-180 -right-3",
        )}
      >
        <ChevronLeft className="h-4 w-4 text-muted-foreground" />
      </button>

      {}
      <div className="flex h-16 items-center shrink-0 overflow-hidden border-b border-border">
        <div className="w-[72px] shrink-0 flex items-center justify-center">
          <div className="h-12 w-12 flex items-center justify-center overflow-hidden">
            <Image
              src="/brasaoguarda.png"
              alt="Brasão da Guarda"
              width={48}
              height={48}
              className="w-12 h-auto object-contain"
              style={{ height: "auto" }}
              priority
            />
          </div>
        </div>
        <div
          className={cn(
            "flex flex-col whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out",
            "opacity-100 translate-x-0",
            !isExpanded &&
              "lg:opacity-0 lg:-translate-x-4 lg:pointer-events-none",
          )}
        >
          <span className="font-semibold text-sm text-foreground">
            SISPORTE
          </span>
          <span className="text-xs text-muted-foreground">São Luís - MA</span>
        </div>
      </div>

      {}
      <TooltipProvider>
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4">
          <div
            className={cn(
              "px-5 mb-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider transition-all duration-300",
              "opacity-100",
              !isExpanded && "lg:opacity-0 lg:-translate-x-2",
            )}
          >
            Gerenciar
          </div>

          <div className="space-y-0.5">{mainItems.map(renderMenuItem)}</div>

          {user?.role === "ADMIN" && (
            <div className="mt-6">
              <div
                className={cn(
                  "px-5 mb-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider transition-all duration-300",
                  "opacity-100",
                  !isExpanded && "lg:opacity-0 lg:-translate-x-2",
                )}
              >
                Sistema
              </div>

              <div className="space-y-0.5">
                {systemItems.map(renderMenuItem)}
              </div>
            </div>
          )}

          <div className="mt-6">
            <div
              className={cn(
                "px-5 mb-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider transition-all duration-300",
                "opacity-100",
                !isExpanded && "lg:opacity-0 lg:-translate-x-2",
              )}
            >
              Ajuda
            </div>

            <div className="space-y-0.5">{helpItems.map(renderMenuItem)}</div>
          </div>
        </nav>
      </TooltipProvider>

      {}
      <div className="mt-auto border-t border-border">
        <Separator className="opacity-50" />
        <div className="py-3 overflow-hidden">
          <div className="flex items-center h-11 group">
            <div className="w-[72px] shrink-0 flex items-center justify-center z-10">
              <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                {user?.name?.charAt(0) || "A"}
              </div>
            </div>
            <div
              className={cn(
                "flex-1 flex flex-col overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out pr-4",
                "opacity-100 translate-x-0",
                !isExpanded &&
                  "lg:opacity-0 lg:-translate-x-4 lg:pointer-events-none",
              )}
            >
              <span className="text-sm font-medium text-foreground truncate">
                {user?.name || "Administrador"}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user?.email || "admin@sicaf.com"}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="relative flex items-center h-10 w-full group mt-1"
          >
            <div className="w-[72px] shrink-0 flex items-center justify-center z-10">
              <LogOut
                className="h-[18px] w-[18px] text-muted-foreground group-hover:text-destructive transition-colors duration-200"
                strokeWidth={1.5}
              />
            </div>
            <div
              className={cn(
                "flex-1 flex items-center overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out pr-4 z-10",
                "opacity-100 translate-x-0",
                !isExpanded &&
                  "lg:opacity-0 lg:-translate-x-4 lg:pointer-events-none",
              )}
            >
              <span className="text-sm text-muted-foreground group-hover:text-destructive transition-colors truncate">
                Sair
              </span>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}
