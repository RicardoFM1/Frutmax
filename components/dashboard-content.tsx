"use client";

import {
  Package,
  Tags,
  AlertTriangle,
  DollarSign,
  TrendingDown,
  Clock,
} from "lucide-react";
import { StatCard } from "./stat-card";
import { StatusBadge } from "./status-badge";
import type { Dashboard, FrutaResumo } from "@/lib/api";

interface DashboardContentProps {
  dashboard: Dashboard;
  frutas: FrutaResumo[];
}

export function DashboardContent({
  dashboard,
  frutas,
}: DashboardContentProps) {
  const frutasVencendo = frutas.filter(
    (f) => f.status_validade === "atencao" || f.status_validade === "critico"
  );
  const frutasVencidas = frutas.filter(
    (f) => f.status_validade === "vencido"
  );
  const frutasEstoqueBaixo = frutas.filter((f) => f.estoque_baixo);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Visao geral do estoque da Frutmax
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Frutas"
          value={dashboard.total_frutas}
          subtitle={`${dashboard.total_categorias} categorias`}
          icon={Package}
          variant="default"
        />
        <StatCard
          title="Estoque Total"
          value={`${dashboard.estoque_total}`}
          subtitle="unidades/kg em estoque"
          icon={Tags}
          variant="success"
        />
        <StatCard
          title="Valor do Estoque"
          value={`R$ ${Number(dashboard.valor_total_estoque).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          subtitle="valor total estimado"
          icon={DollarSign}
          variant="default"
        />
        <StatCard
          title="Alertas Ativos"
          value={dashboard.frutas_vencidas + dashboard.frutas_vencendo + dashboard.estoque_baixo}
          subtitle={`${dashboard.frutas_vencidas} vencidas, ${dashboard.estoque_baixo} estoque baixo`}
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
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent" />
            <h3 className="text-base font-semibold text-card-foreground">
              Proximas do Vencimento
            </h3>
          </div>
          {frutasVencendo.length === 0 && frutasVencidas.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma fruta proxima do vencimento.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {[...frutasVencidas, ...frutasVencendo]
                .slice(0, 5)
                .map((fruta) => (
                  <div
                    key={fruta.id}
                    className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        {fruta.nome}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Validade:{" "}
                        {new Date(fruta.data_validade + "T00:00:00").toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <StatusBadge status={fruta.status_validade} />
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Estoque Baixo */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-destructive" />
            <h3 className="text-base font-semibold text-card-foreground">
              Estoque Baixo
            </h3>
          </div>
          {frutasEstoqueBaixo.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma fruta com estoque baixo.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {frutasEstoqueBaixo.slice(0, 5).map((fruta) => (
                <div
                  key={fruta.id}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      {fruta.nome}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {fruta.quantidade} {fruta.unidade} em estoque
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full border border-destructive/20 bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
                    Baixo
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
