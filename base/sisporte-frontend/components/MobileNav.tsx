"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  CreditCard,
  Shield,
  PlusCircle,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth.service";

const navItems = [
  {
    title: "Início",
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
    title: "Novo",
    href: "/dashboard/guards/add",
    icon: PlusCircle,
  },
  {
    title: "Usuários",
    href: "/dashboard/users",
    icon: Users,
    adminOnly: true,
  },
  {
    title: "Ajuda",
    href: "/dashboard/help",
    icon: HelpCircle,
  },
];

export function MobileNav() {
  const pathname = usePathname();
  const user = authService.getCurrentUser();

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

  const filteredItems = navItems.filter(item => {
    if (item.adminOnly && user?.role !== 'ADMIN') return false;
    return true;
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border px-2 pb-safe lg:hidden">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {filteredItems.map((item) => {
          const active = isActive(item.href, item.match, item.exclude);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors duration-200",
                active ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <item.icon 
                className={cn(
                  "h-5 w-5",
                  active ? "stroke-[2.5px]" : "stroke-[1.5px]"
                )} 
              />
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-tight",
                active ? "opacity-100" : "opacity-70"
              )}>
                {item.title}
              </span>
              {active && (
                <div className="absolute top-0 w-8 h-1 bg-primary rounded-b-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
