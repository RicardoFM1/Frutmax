"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Apple,
  Tags,
  AlertTriangle,
  Package,
  Users,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Estoque",
    href: "/estoque",
    icon: Package,
  },
  {
    label: "Categorias",
    href: "/categorias",
    icon: Tags,
  },
  {
    label: "Alertas",
    href: "/alertas",
    icon: AlertTriangle,
  },
  {
    label: "Fornecedores",
    href: "/fornecedores",
    icon: Users,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Apple className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-card-foreground">
            Frutmax
          </h1>
          <p className="text-xs text-muted-foreground">
            Sistema de Estoque
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border px-4 py-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-muted-foreground">
            Frutmax v1.0.0
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
