"use client"

import { Bell, CircleUserRound, Search, ShoppingBag, ArrowLeft } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { usePathname } from "next/navigation" // Import usePathname

interface HeaderProps {
  title?: string
  searchValue?: string
  onSearch?: (value: string) => void
  showIcons?: boolean
  showBackButton?: boolean
  backUrl?: string
}

export default function Header({
  title = "Dashboard",
  searchValue = "",
  onSearch,
  showIcons = true,
  showBackButton = false,
  backUrl = "/",
}: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname(); // Get current pathname

  // Determine the correct back URL based on the current path
  const effectiveBackUrl = pathname.startsWith("/gestor") ? "/gestor/overview" : "/produtor/overview";

  return (
    <header className="h-16 border-b border-grey-200 w-full flex items-center justify-between px-4 lg:px-6 py-4 bg-white flex-shrink-0">
      {/* Mobile Layout */}
      <div className="flex items-center justify-between w-full md:hidden">
        {!isSearchOpen ? (
          <>
            <div className="flex items-center gap-2 ml-12">
              {showBackButton && (
                <Link href={effectiveBackUrl} className="p-1 hover:bg-grey-100 rounded-full transition-colors">
                  <ArrowLeft className="w-4 h-4 text-grey-600" />
                </Link>
              )}
              <h1 className="text-sm font-semibold text-grey-600 truncate max-w-[120px]">{title}</h1>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-grey-100 rounded-full transition-colors"
              >
                <Search className="w-5 h-5 text-grey-600" />
              </button>
              {pathname.startsWith("/produtor") && ( // Only show shopping bag for producer
                <Link href="/produtor/loja" className="p-2 hover:bg-grey-100 rounded-full transition-colors">
                  <ShoppingBag className="w-5 h-5 text-grey-600" />
                </Link>
              )}
              {showIcons && (
                <>
                  <button className="p-2 hover:bg-grey-100 rounded-full transition-colors">
                    <Bell className="w-5 h-5 text-grey-700" />
                  </button>
                  <button className="p-2 hover:bg-grey-100 rounded-full transition-colors">
                    <CircleUserRound className="w-5 h-5 text-grey-700" />
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 w-full ml-12">
            <div className="relative flex-1 min-w-0">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchValue}
                onChange={(e) => onSearch?.(e.target.value)}
                className="pl-10 h-9 pr-4 py-2 rounded-full bg-grey-200 text-grey-700 placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-primary-main focus:bg-white border border-transparent focus:border-primary-light w-full transition-all"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-400 w-4 h-4" />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSearchOpen(false)}
              className="px-3 py-2 text-grey-600 border-grey-300 hover:bg-grey-50 text-xs flex-shrink-0 rounded-full"
            >
              Cancelar
            </Button>
          </div>
        )}
      </div>

      {/* Tablet Layout */}
      <div className="hidden md:flex lg:hidden items-center justify-between w-full">
        <div className="flex items-center gap-3 ml-16">
          {showBackButton && (
            <Link href={effectiveBackUrl} className="p-1 hover:bg-grey-100 rounded-full transition-colors">
              <ArrowLeft className="w-4 h-4 text-grey-600" />
            </Link>
          )}
          <h1 className="text-sm font-semibold text-grey-600 truncate max-w-[180px]">{title}</h1>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchValue}
              onChange={(e) => onSearch?.(e.target.value)}
              className="pl-9 h-9 pr-4 py-2 rounded-full bg-grey-100 text-grey-700 placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-primary-main focus:bg-white border border-transparent focus:border-primary-light w-48 transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-400 w-4 h-4" />
          </div>
          {pathname.startsWith("/produtor") && ( // Only show shopping bag for producer
            <Link href="/produtor/loja" className="p-2 hover:bg-grey-100 rounded-full transition-colors">
              <ShoppingBag className="w-5 h-5 text-grey-700" />
            </Link>
          )}
          {showIcons && (
            <>
              <button className="p-2 hover:bg-grey-100 rounded-full transition-colors">
                <Bell className="w-5 h-5 text-grey-700" />
              </button>
              <button className="p-2 hover:bg-grey-100 rounded-full transition-colors">
                <CircleUserRound className="w-5 h-5 text-grey-700" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Link href={effectiveBackUrl} className="p-1 hover:bg-grey-100 rounded-full transition-colors">
              <ArrowLeft className="w-4 h-4 text-grey-600" />
            </Link>
          )}
          <h1 className="text-sm font-semibold text-grey-600 truncate">{title}</h1>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchValue}
              onChange={(e) => onSearch?.(e.target.value)}
              className="pl-10 h-9 pr-4 py-2 rounded-full bg-grey-100 text-grey-700 placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-primary-main focus:bg-white border border-transparent focus:border-primary-light w-64 transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-400 w-4 h-4" />
          </div>
          {pathname.startsWith("/produtor") && ( // Only show shopping bag for producer
            <Link href="/produtor/loja" className="p-2 hover:bg-grey-100 rounded-full transition-colors">
              <ShoppingBag className="w-5 h-5 text-grey-700 hover:text-grey-900" />
            </Link>
          )}
          {showIcons && (
            <>
              <button className="p-2 hover:bg-grey-100 rounded-full transition-colors">
                <Bell className="w-5 h-5 text-grey-700 hover:text-grey-900" />
              </button>
              <button className="p-2 hover:bg-grey-100 rounded-full transition-colors">
                <CircleUserRound className="w-5 h-5 text-grey-700 hover:text-grey-900" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}