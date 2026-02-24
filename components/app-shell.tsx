"use client";

import React, { useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar Desktop */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      {/* Sidebar Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity md:hidden",
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar Mobile Content */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-card shadow-xl transition-transform duration-300 ease-in-out md:hidden",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <AppSidebar />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header Mobile */}
        <header className="flex h-16 items-center border-b border-border bg-card px-6 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="-ml-2"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <span className="ml-4 font-bold text-primary">Frutmax</span>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
