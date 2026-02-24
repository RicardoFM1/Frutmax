"use client";

import React, { useState } from "react";
import {
  Package,
  Tags,
  AlertTriangle,
  DollarSign,
  TrendingDown,
  Clock,
  Search,
  Filter,
} from "lucide-react";
import { StatCard } from "./stat-card";
import { StatusBadge } from "./status-badge";
import { Input } from "@/components/ui/input";
import type { Dashboard, FrutaResumo } from "@/lib/api";
import { cn } from "@/lib/utils";

interface DashboardContentProps {
  dashboard: Dashboard;
  frutas: FrutaResumo[];
}

export function DashboardContent({
  dashboard,
  frutas,
}: DashboardContentProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFrutas = frutas.filter(f =>
    f.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const frutasVencendo = filteredFrutas.filter(
    (f) => f.status_validade === "atencao" || f.status_validade === "critico"
  );
  const frutasVencidas = filteredFrutas.filter(
    (f) => f.status_validade === "vencido"
  );
  const frutasEstoqueBaixo = filteredFrutas.filter((f) => f.estoque_baixo);

  // Unidades labels
  const unitLabels: Record<string, string> = {
    kg: "Kg",
    un: "Unidades",
    cx: "Caixas"
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h2>
          <p className="mt-1 text-muted-foreground">
            Visão geral da sua operação Frutmax
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filtrar dados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Produtos"
          value={dashboard.total_frutas}
          subtitle={`${dashboard.total_categorias} categorias ativas`}
          icon={Package}
          variant="default"
        />
        <div className="relative group">
          <StatCard
            title="Estoque Total"
            value={dashboard.estoque_total}
            subtitle="Volume total estocado"
            icon={Tags}
            variant="success"
          />
          {/* Breakdown tooltip-like display on hover or small text */}
          <div className="mt-2 flex flex-wrap gap-2 px-1">
            {Object.entries(dashboard.estoque_por_unidade || {}).map(([unit, total]) => (
              <span key={unit} className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                {total} {unitLabels[unit] || unit}
              </span>
            ))}
          </div>
        </div>
        <StatCard
          title="Valor Estimado"
          value={`R$ ${Number(dashboard.valor_total_estoque).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          subtitle="Capital imobilizado"
          icon={DollarSign}
          variant="default"
        />
        <StatCard
          title="Alertas Críticos"
          value={dashboard.frutas_vencidas + dashboard.frutas_vencendo + dashboard.estoque_baixo}
          subtitle={`${dashboard.frutas_vencidas} vencidas agora`}
          icon={AlertTriangle}
          variant={
            dashboard.frutas_vencidas > 0
              ? "danger"
              : dashboard.frutas_vencendo > 0
                ? "warning"
                : "default"
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Frutas proximas do vencimento */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-orange-500/10 p-2">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <h3 className="text-lg font-bold text-card-foreground">
                Vencimento Próximo
              </h3>
            </div>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
              Próximos 7 dias
            </span>
          </div>

          {frutasVencendo.length === 0 && frutasVencidas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Clock className="h-10 w-10 text-muted-foreground/20" />
              <p className="mt-2 text-sm text-muted-foreground">Tudo em dia por aqui.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {[...frutasVencidas, ...frutasVencendo]
                .slice(0, 5)
                .map((fruta) => (
                  <div
                    key={fruta.id}
                    className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-card-foreground">
                        {fruta.nome}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Expira em: {new Date(fruta.data_validade + "T00:00:00").toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <StatusBadge status={fruta.status_validade} />
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Estoque Baixo */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-destructive/10 p-2">
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
              <h3 className="text-lg font-bold text-card-foreground">
                Reposição Necessária
              </h3>
            </div>
          </div>

          {frutasEstoqueBaixo.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <TrendingDown className="h-10 w-10 text-muted-foreground/20" />
              <p className="mt-2 text-sm text-muted-foreground">Estoque abastecido.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {frutasEstoqueBaixo.slice(0, 5).map((fruta) => (
                <div
                  key={fruta.id}
                  className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex flex-col">
                    <p className="text-sm font-bold text-card-foreground">
                      {fruta.nome}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      Apenas {fruta.quantidade} {fruta.unidade} restantes
                    </p>
                  </div>
                  <div className="rounded-full bg-destructive/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-destructive border border-destructive/20">
                    Repor
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
