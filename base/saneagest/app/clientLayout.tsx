"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./../components/Sidebar";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const isGestorPath = pathname?.startsWith("/gestor");
  const isProdutorPath = pathname?.startsWith("/produtor");
  const isLojaPath = pathname === "/produtor/loja"; // Nova condição para a página da loja

  let sidebarComponent = null;
  if (isProdutorPath && !isLojaPath) {
    // Renderiza Sidebar apenas se não for a página da loja
    sidebarComponent = <Sidebar userType="produtor" />;
  } else if (isGestorPath) {
    sidebarComponent = <Sidebar userType="gestor" />;
  }

  return (
    <div className="flex h-screen bg-grey-200">
      {sidebarComponent}
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
