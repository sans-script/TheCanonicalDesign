import { Home, Users, Settings, BarChart, LayoutDashboard, LucideIcon } from "lucide-react";

export interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  submenu?: { title: string; href: string }[];
}

export const navigationLinks: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];
