import { cn } from "@/lib/utils";

type StatusValidade = "ok" | "atencao" | "critico" | "vencido";

const statusConfig: Record<
  StatusValidade,
  { label: string; className: string }
> = {
  ok: {
    label: "OK",
    className:
      "bg-primary/10 text-primary border-primary/20",
  },
  atencao: {
    label: "Atenção",
    className:
      "bg-accent/10 text-accent border-accent/20",
  },
  critico: {
    label: "Crítico",
    className:
      "bg-destructive/10 text-destructive border-destructive/20",
  },
  vencido: {
    label: "Vencido",
    className:
      "bg-destructive/15 text-destructive border-destructive/30",
  },
};

export function StatusBadge({ status }: { status: StatusValidade }) {
  const config = statusConfig[status] || statusConfig.ok;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
