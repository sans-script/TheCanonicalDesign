import { Bell, Search, Settings, User, Menu, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Logo from "@/components/Logo";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white ">
      <div className="flex h-16 items-center justify-between">
        {/* Logo and Menu */}
        <div className="flex items-center gap-4 pl-3 md:pl-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-1">
            {/* <div className="p-2">
              <Logo className="h-8 w-8" fill="url(#logo-gradient)" />
              <svg width="0" height="0">
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6366f1" /> 
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </svg>
            </div> */}
            <div>
              <h1 className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Neumann
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Healthcare Monitoring Platform
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-sm mx-8 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Pesquisar funcionários, dispositivos..."
              className="pl-10 bg-muted/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 pr-1">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="flex items-center justify-center relative h-10 w-10 mt-1">
            <Bell className="h-10 w-10" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-destructive rounded-full text-[10px] flex items-center justify-center text-white font-semibold py-0.5">
              5
            </span>
          </Button>
          {/* User Info */}
          <div className="flex gap-3 p-6+ md:pr-6">
            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="gradient-neumann text-white font-semibold">
                      AS
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Dr. Ana Silva
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      ana.silva@neumann.com
                    </p>
                    <p className="text-xs leading-none text-primary font-medium">
                      Administrador SESST
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* <div className="flex items-center gap-3">
              <div>
                <h3 className="font-semibold text-sm">Dr. Ana Silva</h3>
                <p className="text-xs text-muted-foreground">
                  Administrador SESST
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </header>
  );
}
