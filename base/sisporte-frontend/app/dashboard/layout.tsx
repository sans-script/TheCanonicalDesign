"use client";

import * as React from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { authService } from "@/services/auth.service";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  const userName = user?.name || "Administrador";

  const greeting = React.useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const [isCollapsed, setIsCollapsed] = React.useState(true);
  
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setIsCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth >= 1280) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <AuthGuard>
      <div className="dashboard-shell flex h-screen bg-background overflow-hidden relative font-sans">
        <AppSidebar
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          className="dashboard-sidebar"
        />
        <div className="dashboard-content flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center justify-start h-14 lg:h-16 px-4 lg:px-6 border-b border-border bg-card shrink-0">
            <div className="flex items-center gap-4 h-full items-center justify-center">
              <p className="text-base lg:text-lg text-foreground leading-none mb-1 font-bold mt-3">
                {greeting}, {userName}
              </p>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6 pb-24 lg:p-8 lg:pb-8">
            {children}
          </main>
        </div>
        <MobileNav />
      </div>
    </AuthGuard>
  );
}
