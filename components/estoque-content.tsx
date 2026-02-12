"use client";

import { useState } from "react";
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
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import type { FrutaResumo, Fruta, Categoria, FrutaFormData } from "@/lib/api";

interface EstoqueContentProps {
  frutas: FrutaResumo[];
  categorias: Categoria[];
  onAdd: (data: FrutaFormData) => void;
  onUpdate: (id: number, data: FrutaFormData) => void;
  onDelete: (id: number) => void;
  getFruta: (id: number) => Fruta | null;
}

export function EstoqueContent({
  frutas,
  categorias,
  onAdd,
  onUpdate,
  onDelete,
  getFruta,
}: EstoqueContentProps) {
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingFruta, setEditingFruta] = useState<Fruta | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filtered = frutas.filter(
    (f) =>
      f.nome.toLowerCase().includes(search.toLowerCase()) ||
      f.categoria_nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (id: number) => {
    const fruta = getFruta(id);
    setEditingFruta(fruta);
    setFormOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const handleFormSubmit = (data: FrutaFormData) => {
    if (editingFruta) {
      onUpdate(editingFruta.id, data);
    } else {
      onAdd(data);
    }
    setFormOpen(false);
    setEditingFruta(null);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      onDelete(deletingId);
    }
    setDeleteOpen(false);
    setDeletingId(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Estoque
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie as frutas do estoque
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingFruta(null);
            setFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Fruta
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar frutas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground">Nome</TableHead>
              <TableHead className="text-muted-foreground">Categoria</TableHead>
              <TableHead className="text-right text-muted-foreground">
                {"Preco (R$)"}
              </TableHead>
              <TableHead className="text-right text-muted-foreground">
                Quantidade
              </TableHead>
              <TableHead className="text-muted-foreground">Validade</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-right text-muted-foreground">
                Acoes
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-muted-foreground"
                >
                  Nenhuma fruta encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((fruta) => (
                <TableRow key={fruta.id}>
                  <TableCell className="font-medium text-card-foreground">
                    {fruta.nome}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {fruta.categoria_nome || "-"}
                  </TableCell>
                  <TableCell className="text-right text-card-foreground">
                    {Number(fruta.preco).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right text-card-foreground">
                    {fruta.quantidade} {fruta.unidade}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(fruta.data_validade + "T00:00:00").toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={fruta.status_validade} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(fruta.id)}
                        aria-label={`Editar ${fruta.nome}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(fruta.id)}
                        aria-label={`Remover ${fruta.nome}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
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
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Remover Fruta"
        description="Tem certeza que deseja remover esta fruta do estoque? Esta acao nao pode ser desfeita."
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
