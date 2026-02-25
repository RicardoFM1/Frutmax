"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./status-badge";
import { FrutaFormDialog } from "./fruta-form-dialog";
import { ConfirmDialog } from "./confirm-dialog";
import { Plus, Search, Pencil, Trash2, Filter, Download } from "lucide-react";
import type { FrutaResumo, Fruta, Categoria, Fornecedor, FrutaFormData } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface EstoqueContentProps {
  frutas: FrutaResumo[];
  categorias: Categoria[];
  fornecedores: Fornecedor[];
  onAdd: (data: FrutaFormData) => Promise<void>;
  onUpdate: (id: number, data: FrutaFormData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  getFruta: (id: number) => Promise<Fruta | null>;
}

export function EstoqueContent({
  frutas,
  categorias,
  fornecedores,
  onAdd,
  onUpdate,
  onDelete,
  getFruta,
}: EstoqueContentProps) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingFruta, setEditingFruta] = useState<Fruta | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const filtered = frutas.filter((f) => {
    const matchesSearch = f.nome.toLowerCase().includes(search.toLowerCase());
    const matchesCat = catFilter === "all" || f.categoria_nome === catFilter;
    return matchesSearch && matchesCat;
  });

  const handleEdit = async (id: number) => {
    try {
      const fruta = await getFruta(id);
      setEditingFruta(fruta);
      setFormOpen(true);
    } catch (error) {
      toast.error("Erro ao carregar detalhes do produto.");
    }
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (data: FrutaFormData) => {
    setLoading(true);
    try {
      if (editingFruta) {
        await onUpdate(editingFruta.id, data);
        toast.success("Produto atualizado com sucesso!");
      } else {
        await onAdd(data);
        toast.success("Produto cadastrado com sucesso!");
      }
      setFormOpen(false);
      setEditingFruta(null);
    } catch (error) {
      toast.error("Erro ao salvar produto.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingId) {
      try {
        await onDelete(deletingId);
        toast.success("Produto removido com sucesso!");
      } catch (error) {
        toast.error("Erro ao remover produto.");
      }
    }
    setDeleteOpen(false);
    setDeletingId(null);
  };

  const handleExportPdf = () => {
    if (filtered.length === 0) {
      toast.error("Nao ha dados para exportar.");
      return;
    }

    const today = new Date().toLocaleString("pt-BR");
    const rows = filtered
      .map(
        (fruta) => `
          <tr>
            <td>${fruta.nome}</td>
            <td>${fruta.categoria_nome || "Sem Categ."}</td>
            <td>R$ ${Number(fruta.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
            <td>${fruta.quantidade} ${fruta.unidade}</td>
            <td>${new Date(fruta.data_validade + "T00:00:00").toLocaleDateString("pt-BR")}</td>
            <td>${fruta.status_validade}</td>
          </tr>
        `
      )
      .join("");

    const reportHtml = `
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8" />
          <title>Relatorio de Estoque</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; color: #111; }
            h1 { margin: 0 0 6px; font-size: 20px; }
            p { margin: 0 0 16px; color: #555; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #f3f4f6; }
            @media print { @page { size: A4; margin: 12mm; } }
          </style>
        </head>
        <body>
          <h1>Relatorio de Estoque - Frutmax</h1>
          <p>Gerado em ${today}</p>
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preco</th>
                <th>Saldo</th>
                <th>Validade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc || !iframe.contentWindow) {
      document.body.removeChild(iframe);
      toast.error("Nao foi possivel gerar o PDF.");
      return;
    }

    doc.open();
    doc.write(reportHtml);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      }, 1000);
    }, 200);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Estoque
          </h2>
          <p className="mt-1 text-muted-foreground">
            Controle e gerenciamento de inventário.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="hidden sm:flex" onClick={handleExportPdf}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button
            onClick={() => {
              setEditingFruta(null);
              setFormOpen(true);
            }}
            className="bg-primary hover:bg-primary/90 shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Produto
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-border h-11"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={catFilter} onValueChange={setCatFilter}>
            <SelectTrigger className="w-full sm:w-[180px] h-11 bg-card">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Categorias</SelectItem>
              {categorias.map((cat) => (
                <SelectItem key={cat.id} value={cat.nome}>
                  {cat.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="font-bold py-4">Produto</TableHead>
              <TableHead className="font-bold">Categoria</TableHead>
              <TableHead className="text-right font-bold">Preço</TableHead>
              <TableHead className="text-right font-bold">Saldo</TableHead>
              <TableHead className="font-bold">Validade</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold px-6">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 text-muted-foreground/20" />
                    <p>Nenhum produto encontrado com os filtros atuais.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((fruta) => (
                <TableRow key={fruta.id} className="border-border hover:bg-muted/30 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-card-foreground">{fruta.nome}</span>
                      {fruta.estoque_baixo && (
                        <span className="text-[10px] font-black text-destructive uppercase tracking-tighter">Estoque Crítico</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-lg bg-secondary/50 px-2 py-1 text-xs font-semibold text-secondary-foreground">
                      {fruta.categoria_nome || "Sem Categ."}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    R$ {Number(fruta.preco).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={cn(
                      "font-bold",
                      fruta.estoque_baixo ? "text-destructive" : "text-card-foreground"
                    )}>
                      {fruta.quantidade} {fruta.unidade}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(fruta.data_validade + "T00:00:00").toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={fruta.status_validade} />
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                        onClick={() => handleEdit(fruta.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
                        onClick={() => handleDelete(fruta.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <FrutaFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        fruta={editingFruta}
        categorias={categorias}
        fornecedores={fornecedores}
        onSubmit={handleFormSubmit}
        loading={loading}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Remover do Estoque"
        description={`Tem certeza que deseja remover este produto definitivamente?`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
