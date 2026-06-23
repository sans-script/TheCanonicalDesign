"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Watch,
  Settings,
  FileBarChart,
  HelpCircle,
  Activity,
  ChevronRight,
  Brain,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  MonitorCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/* -------------------------------------------------------------------------- */
/*                                CONSTANTS                                   */
/* -------------------------------------------------------------------------- */

const MENU_ITEMS = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "GSR Monitor",
    icon: Activity,
    href: "/gsr",
  },
  {
    title: "Wearables",
    icon: Watch,
    href: "/wearables",
    submenu: [
      { title: "Dispositivos", href: "/wearables/devices" },
      { title: "Funcionários", href: "/wearables/employees" },
      { title: "Análise Ergonômica", href: "/wearables/ergonomics" },
    ],
  },
  {
    title: "IA & Análises",
    icon: Brain,
    href: "/analytics",
    submenu: [
      { title: "Detecção de Anomalias", href: "/analytics/anomalies" },
      { title: "Predições", href: "/analytics/predictions" },
      { title: "Padrões de Risco", href: "/analytics/risk-patterns" },
    ],
  },
  {
    title: "Relatórios",
    icon: FileBarChart,
    href: "/reports",
    submenu: [
      { title: "SESST", href: "/reports/sesst" },
      { title: "RH", href: "/reports/hr" },
      { title: "Analytics Avançado", href: "/reports/advanced" },
    ],
  },
  {
    title: "Sistema",
    icon: MonitorCog,
    href: "/system",
    submenu: [
      { title: "Versões", href: "/system/versions" },
      { title: "Monitoramento", href: "/system/monitoring" },
      { title: "Integrações", href: "/system/integrations" },
    ],
  },
  {
    title: "Intervenções",
    icon: Activity,
    href: "/interventions",
    submenu: [
      { title: "Planos de Ação", href: "/interventions/action-plans" },
      { title: "Follow-up", href: "/interventions/followup" },
      { title: "Biblioteca", href: "/interventions/library" },
    ],
  },
  {
    title: "Configurações",
    icon: Settings,
    href: "/settings",
  },
  {
    title: "Ajuda & Suporte",
    icon: HelpCircle,
    href: "/help",
  },
];

/* -------------------------------------------------------------------------- */
/*                                INTERFACES                                  */
/* -------------------------------------------------------------------------- */

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export function Sidebar({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();

  // Reset expanded items when collapsed
  useEffect(() => {
    if (isCollapsed) {
      setExpandedItems([]);
    }
  }, [isCollapsed]);

  const toggleExpanded = (title: string) => {
    if (isCollapsed) return;
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const isActiveLink = (href: string) => pathname === href;

  // Determine if sidebar content should be fully visible
  // Visible if NOT collapsed OR if it's open on mobile (drawer mode)
  const showFullSidebar = !isCollapsed || isOpen;

  // Sidebar width constants
  const SIDEBAR_WIDTH_COLLAPSED = "md:w-[80px]";
  const SIDEBAR_WIDTH_EXPANDED = "md:w-72";

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          // Base Layout
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-white shrink-0",
          // Mobile vs Desktop
          "md:relative",
          // Transitions
          "transition-[width,transform] duration-300 ease-in-out",
          // Width Control
          isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED,
          // Mobile Drawer Logic
          isOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Toggle Button - Floating Badge Style */}
        <div className="absolute -right-3 top-7 z-50 hidden md:block">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 rounded-full border shadow-sm bg-white hover:bg-slate-50 p-0"
            onClick={onToggleCollapse}
          >
            {isCollapsed ? (
              <ChevronsRight className="h-3 w-3 text-muted-foreground" />
            ) : (
              <ChevronsLeft className="h-3 w-3 text-muted-foreground" />
            )}
          </Button>
        </div>

        {/* Header / User Info Area */}
        {/* Fixed height container */}
        <div className="flex h-20 items-center shrink-0 border-b border-transparent overflow-hidden relative">

          {/* Static Icon/Avatar Container - Always 80px wide to center content in collapsed mode */}
          <div className="w-[80px] shrink-0 flex items-center justify-center">
            <Avatar className="h-10 w-10 border border-primary/10">
              <AvatarFallback className="bg-primary/5 text-primary font-bold text-sm">
                AS
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Text Info - Fades in/out with slide effect */}
          <div
            className={cn(
              "flex flex-col whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out",
              !showFullSidebar ? "opacity-0 -translate-x-4" : "opacity-100 translate-x-0"
            )}
          >
            <h3 className="text-sm font-semibold text-foreground">Dr. Ana Silva</h3>
            <p className="text-xs text-muted-foreground">Admin SESST</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 scrollbar-thin">
          <ul className="space-y-2">
            {MENU_ITEMS.map((item) => {
              const active = isActiveLink(item.href);
              const isExpanded = expandedItems.includes(item.title);
              const hasSubmenu = !!item.submenu;

              /* 
                 Visual Layering Strategy:
                 1. Layout Container (li): Relative positioning context.
                 2. Background Layer (div): Absolute active/hover shapes. Handles the morphing square/rect logic.
                 3. Content Layer (div wrapper): Flexbox strictly positioning icon (fixed left column) and text.
              */

              const ItemContent = (
                <div
                  className="relative flex items-center h-10 w-full cursor-pointer group"
                  onClick={() => hasSubmenu ? toggleExpanded(item.title) : null}
                >
                  {/* ACTIVE BACKGROUND SHAPE */}
                  {active && (
                    <div
                      className={cn(
                        "absolute top-0 bottom-0 bg-primary/10 border border-primary/20",
                        "transition-all duration-300 ease-in-out",
                        // Unified left position to 20px to prevent "jumping" from left edge.
                        // Expands to right-4 (16px) in expanded mode, effectively growing to the right.
                        "left-[20px]",
                        !showFullSidebar
                          ? "w-10 rounded-xl" // Square (40px)
                          : "right-4 rounded-md" // Full width (approx)
                      )}
                    />
                  )}

                  {/* HOVER BACKGROUND SHAPE (When not active) */}
                  {/* HOVER BACKGROUND SHAPE REMOVED per user request */}

                  {/* STATIC ICON CONTAINER - Always 80px wide to match collapsed width */}
                  <div className="w-[80px] shrink-0 flex items-center justify-center z-10">
                    <item.icon
                      className={cn(
                        "h-[18px] w-[18px] transition-colors duration-200", // Reduced icon size
                        active ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                      )}
                    />
                  </div>

                  {/* TEXT CONTAINER - Slides/Fades next to icon */}
                  {/* Removed w-0/w-full to rely on flex shrinking + overflow hidden for smoother collapse */}
                  <div className={cn(
                    "flex-1 flex items-center justify-between overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out pr-4 z-10",
                    !showFullSidebar ? "opacity-0 -translate-x-4" : "opacity-100 translate-x-0"
                  )}>
                    <span className={cn(
                      "text-sm font-medium transition-colors",
                      active ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                    )}>
                      {item.title}
                    </span>

                    {/* Submenu Arrow */}
                    {hasSubmenu && (
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform duration-200",
                          isExpanded ? "rotate-90" : ""
                        )}
                      />
                    )}
                  </div>
                </div>
              );

              // RENDER LOGIC
              if (hasSubmenu) {
                return (
                  <li key={item.title}>
                    {!showFullSidebar ? (
                      // Collapsed Submenu -> Tooltip only, no expansion behavior strictly
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>{ItemContent}</div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="font-semibold" sideOffset={10}>
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      // Expanded Submenu -> Normal behavior
                      <div>
                        {ItemContent}
                        {isExpanded && showFullSidebar && (
                          <div className="mt-1 space-y-1 overflow-hidden animate-in slide-in-from-top-1 duration-200">
                            {item.submenu!.map((sub) => (
                              <Link key={sub.href} href={sub.href} className="block group/sub">
                                <div className="flex items-center h-8 relative cursor-pointer">
                                  {/* Submenu indentation matching icon center line approx */}
                                  <div className="w-[80px] shrink-0 flex justify-center">
                                    <div className="w-[1px] h-full bg-border group-hover/sub:bg-primary/50" />
                                  </div>
                                  <div className={cn(
                                    "flex-1 text-sm text-muted-foreground hover:text-foreground pl-2 py-1 rounded-md mr-4 transition-colors",
                                    isActiveLink(sub.href) && "text-primary font-medium bg-muted"
                                  )}>
                                    {sub.title}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                );
              }

              return (
                <li key={item.title}>
                  {!showFullSidebar ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={item.href}>{ItemContent}</Link>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="font-semibold" sideOffset={10}>
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Link href={item.href}>{ItemContent}</Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Logout Section Placeholder in Nav */}
        </nav>

        {/* Fixed Logout Button at bottom */}
        <div className="mt-auto pb-6">
          <Link href="/logout" className="group relative flex items-center h-10 w-full cursor-pointer">
            {/* Hover Background */}
            <div
              className={cn(
                "absolute top-0 bottom-0 hover:bg-red-50 transition-all duration-300 ease-in-out",
                "left-[20px]",
                !showFullSidebar
                  ? "w-10 rounded-xl opacity-0 group-hover:opacity-100"
                  : "right-4 rounded-md opacity-0 group-hover:opacity-100"
              )}
            />

            <div className="w-[80px] shrink-0 flex items-center justify-center z-10">
              <LogOut className="h-[18px] w-[18px] text-red-600 transition-transform group-hover:scale-110" />
            </div>

            <div className={cn(
              "flex-1 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out z-10",
              !showFullSidebar ? "opacity-0 -translate-x-4" : "opacity-100 translate-x-0"
            )}>
              <span className="text-sm font-medium text-red-600">Sair da Conta</span>
            </div>
          </Link>
        </div>

        {/* Footer Info */}
        <div className="px-4 pb-4 overflow-hidden">
          <div className={cn(
            "text-xs text-muted-foreground transition-all duration-300 ease-in-out whitespace-nowrap flex flex-col items-center",
            !showFullSidebar ? "opacity-0 translate-y-4 h-0" : "opacity-100 translate-y-0 h-auto"
          )}>
            <p>Neumann v1.0</p>
            <p className="text-[10px] mt-0.5">LGPD Compliant</p>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}
    </TooltipProvider>
  );
}
