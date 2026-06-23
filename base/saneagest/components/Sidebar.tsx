"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sprout,
  Box,
  Factory,
  FileText,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  DollarSign,
  Truck,
  BarChart3,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface SidebarProps {
  userType?: "produtor" | "gestor";
}

export default function Sidebar({ userType = "produtor" }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const produtorMenuItems = [
    {
      section: "Dashboards",
      items: [
        {
          href: "/produtor/overview",
          icon: LayoutDashboard,
          label: "Overview",
          iconColor: "text-primary-main",
        },
        {
          href: "/produtor/propriedades",
          icon: Sprout,
          label: "Minhas Propriedades",
          iconColor: "text-success-main",
        },
      ],
    },
    {
      section: "Páginas",
      items: [
        {
          href: "/produtor/solicitacoes",
          icon: Box,
          label: "Minhas Solicitações",
          iconColor: "text-info-main",
          hasChevron: true,
        },
        {
          href: "/produtor/etes-parceiras",
          icon: Factory,
          label: "ETEs Parceiras",
          iconColor: "text-secondary-main",
        },
        {
          href: "/produtor/documentos",
          icon: FileText,
          label: "Documentos e Licenças",
          iconColor: "text-warning-main",
        },
        {
          href: "/produtor/ajuda",
          icon: HelpCircle,
          label: "Ajuda",
          iconColor: "text-grey-600",
        },
      ],
    },
  ];

  const gestorMenuItems = [
    {
      section: "Dashboards",
      items: [
        {
          href: "/gestor/overview",
          icon: LayoutDashboard,
          label: "Overview",
          iconColor: "text-secondary-main",
        },
        {
          href: "/gestor/etes",
          icon: Factory,
          label: "Minhas ETEs",
          iconColor: "text-info-main",
        },
      ],
    },
    {
      section: "Páginas",
      items: [
        {
          href: "/gestor/solicitacoes",
          icon: Box,
          label: "Solicitações Recebidas",
          iconColor: "text-warning-main",
          hasChevron: true,
        },
        {
          href: "/gestor/producao",
          icon: BarChart3,
          label: "Controle de Produção",
          iconColor: "text-success-main",
        },
        {
          href: "/gestor/destinacao",
          icon: Truck,
          label: "Destinação do Lodo",
          iconColor: "text-primary-main",
        },
        {
          href: "/gestor/documentos",
          icon: FileText,
          label: "Licenças e Certificados",
          iconColor: "text-error-main",
        },
        {
          href: "/gestor/financeiro",
          icon: DollarSign,
          label: "Financeiro",
          iconColor: "text-secondary-main",
        },
        {
          href: "/gestor/relatorios",
          icon: BarChart3,
          label: "Relatórios",
          iconColor: "text-info-main",
        },
      ],
    },
  ];

  const menuItems = userType === "gestor" ? gestorMenuItems : produtorMenuItems;
  const logoIcon = userType === "gestor" ? Factory : Sprout;
  const LogoIcon = logoIcon;

  const closeMobileSidebar = () => setIsMobileOpen(false);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const SidebarItem = ({
    item,
    isActive,
  }: {
    item: any;
    isActive: boolean;
  }) => {
    const Icon = item.icon;
    const activeColors =
      userType === "gestor"
        ? "bg-secondary-lighter text-secondary-dark"
        : "bg-primary-lighter text-primary-dark";
    const activeIconColor =
      userType === "gestor" ? "text-secondary-main" : "text-primary-main";

    return (
      <Link
        href={item.href}
        onClick={closeMobileSidebar}
        className={`
          flex items-center gap-3 px-3 py-3 h-12 transition-all duration-200 group relative rounded-xl
          ${
            isActive
              ? `${activeColors} shadow-sm`
              : "text-grey-700 hover:bg-grey-100 hover:text-grey-900"
          }
        `}
      >
        <Icon
          className={`w-6 h-6 transition-colors flex-shrink-0 ${
            isActive
              ? activeIconColor
              : `${item.iconColor} group-hover:text-grey-700`
          }`}
        />
        <span
          className={`text-md font-medium flex-1 mt-1 truncate whitespace-nowrap transition-opacity duration-300 ${
            isCollapsed ? "opacity-0" : "opacity-100"
          }`}
        >
          {item.label}
        </span>
        {item.hasChevron && !isCollapsed && (
          <ChevronRight className="w-4 h-4 text-grey-300 group-hover:text-grey-500 transition-colors flex-shrink-0" />
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden p-2 hover:bg-grey-100"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          flex flex-col h-screen bg-white border-r border-grey-200
          transition-all duration-300 ease-in-out
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          ${isCollapsed ? "lg:w-20" : "lg:w-80"}
        `}
        style={{
          width: isMobileOpen ? "320px" : isCollapsed ? "75px" : "320px",
        }}
      >
        {/* Logo/Brand */}
        <div className="flex items-center justify-between px-6 py-6">
          <div
            className="flex -ml-[8px] items-center gap-3 justify-start cursor-pointer"
            onClick={() => !isMobileOpen && toggleCollapse()}
          >
            <div
              className={`w-10 h-10 rounded-full ${
                userType === "gestor" ? "bg-secondary-main" : "bg-primary-main"
              } flex items-center justify-center flex-shrink-0`}
            >
              <LogoIcon className="w-5 h-5 text-white" />
            </div>
            <span
              className={`text-lg font-semibold text-grey-900 whitespace-nowrap transition-opacity duration-300 ${
                isCollapsed ? "opacity-0" : "opacity-100"
              }`}
            >
              SaneaGest
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden flex-shrink-0"
            onClick={closeMobileSidebar}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <div className={`flex-1 px-3 overflow-hidden`}>
          {menuItems.map((section) => (
            <div key={section.section} className="mb-8">
              <div
                className={`text-grey-400 text-xs font-medium mb-4 uppercase tracking-wide px-3 transition-opacity duration-300 ${
                  isCollapsed ? "opacity-0" : "opacity-100"
                }`}
              >
                {section.section}
              </div>
              <nav>
                <ul className="space-y-2">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                      <li key={item.href}>
                        <SidebarItem item={item} isActive={isActive} />
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className={`border-t border-grey-200 pt-4 pb-6 px-3`}>
          <button className="flex items-center gap-3 px-3 py-3 h-12 w-full text-grey-700 hover:bg-grey-100 hover:text-grey-900 rounded-xl transition-all duration-200 group mb-2">
            <Settings className="w-5 h-5 text-grey-500 group-hover:text-grey-700 transition-colors flex-shrink-0" />
            <span
              className={`text-sm font-medium whitespace-nowrap transition-opacity duration-300 ${
                isCollapsed ? "opacity-0" : "opacity-100"
              }`}
            >
              Configurações
            </span>
          </button>

          <button className="flex items-center gap-3 px-3 py-3 h-12 w-full text-error-main hover:bg-error-lighter rounded-xl transition-all duration-200 group">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span
              className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
              }`}
            >
              Sair
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
