import React from "react"
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const _inter = Inter({ subsets: ["latin"] });

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
    <html lang="pt-BR">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
