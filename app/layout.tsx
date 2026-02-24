import React from "react"
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";
import { AppShell } from "@/components/app-shell";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Frutmax - Sistema de Estoque",
  description:
    "Sistema de gerenciamento de estoque da fruteira Frutmax. Cadastro de frutas, controle de estoque e vencimento.",
};

export const viewport: Viewport = {
  themeColor: "#2e9e47",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn(inter.className, "antialiased")} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppShell>{children}</AppShell>
          <Toaster position="top-right" closeButton richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
