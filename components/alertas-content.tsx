"use client";

import React from "react";
import {
    AlertTriangle,
    Clock,
    TrendingDown,
    ExternalLink,
    ChevronRight
} from "lucide-react";
import type { FrutaResumo } from "@/lib/api";
import { StatusBadge } from "./status-badge";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AlertasContentProps {
    frutas: FrutaResumo[];
}

export function AlertasContent({ frutas }: AlertasContentProps) {
    const vencidas = frutas.filter(f => f.status_validade === "vencido");
    const criticas = frutas.filter(f => f.status_validade === "critico");
    const estoqueBaixo = frutas.filter(f => f.estoque_baixo);

    const totalAlertas = vencidas.length + criticas.length + estoqueBaixo.length;

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-700">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                    Centro de Alertas
                    {totalAlertas > 0 && (
                        <span className="inline-flex items-center justify-center rounded-full bg-destructive px-2.5 py-0.5 text-sm font-bold text-destructive-foreground">
                            {totalAlertas}
                        </span>
                    )}
                </h2>
                <p className="mt-1 text-muted-foreground">
                    Itens que requerem sua atenção imediata ou reposição.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Seção de Validade */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 px-1">
                        <Clock className="h-5 w-5 text-orange-500" />
                        <h3 className="font-bold text-lg">Alertas de Validade</h3>
                    </div>

                    <div className="flex flex-col gap-3">
                        {[...vencidas, ...criticas].map(f => (
                            <div
                                key={f.id}
                                className={cn(
                                    "group relative flex items-center justify-between rounded-2xl border p-4 transition-all hover:bg-muted/30",
                                    f.status_validade === "vencido" ? "border-destructive/30 bg-destructive/5" : "border-orange-500/30 bg-orange-500/5 shadow-sm"
                                )}
                            >
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-card-foreground">{f.nome}</span>
                                        <StatusBadge status={f.status_validade} />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Data: {new Date(f.data_validade + "T00:00:00").toLocaleDateString("pt-BR")}
                                    </p>
                                </div>
                                <Link href="/estoque">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        ))}

                        {vencidas.length === 0 && criticas.length === 0 && (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-12 text-center bg-muted/20">
                                <Clock className="h-8 w-8 text-muted-foreground/30 mb-2" />
                                <p className="text-sm text-muted-foreground font-medium">Nenhum alerta de validade.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Seção de Estoque */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 px-1">
                        <TrendingDown className="h-5 w-5 text-destructive" />
                        <h3 className="font-bold text-lg">Alertas de Estoque</h3>
                    </div>

                    <div className="flex flex-col gap-3">
                        {estoqueBaixo.map(f => (
                            <div
                                key={f.id}
                                className="group relative flex items-center justify-between rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/50"
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="font-bold text-card-foreground">{f.nome}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-black text-destructive uppercase tracking-widest">Estoque Baixo</span>
                                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                            Saldo: {f.quantidade} {f.unidade}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link href="/estoque">
                                        <Button variant="outline" size="sm" className="hidden sm:flex">
                                            Ver no Estoque
                                        </Button>
                                    </Link>
                                    <Link href="/estoque">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 sm:hidden">
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}

                        {estoqueBaixo.length === 0 && (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-12 text-center bg-muted/20">
                                <TrendingDown className="h-8 w-8 text-muted-foreground/30 mb-2" />
                                <p className="text-sm text-muted-foreground font-medium">Estoque está saudável.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sugestão de ação */}
            {totalAlertas > 0 && (
                <div className="rounded-2xl bg-primary/5 border border-primary/20 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h4 className="font-bold text-primary">Ação Recomendada</h4>
                        <p className="text-sm text-muted-foreground">Existem itens que precisam de reposição ou descarte imediato. Recomendamos verificar os lotes no estoque.</p>
                    </div>
                    <Link href="/estoque">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            Ir para o Estoque
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
