"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Tags, MoreVertical, Pencil, Trash2 } from "lucide-react";
import type { Categoria } from "@/lib/api";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CategoriasContentProps {
  categorias: Categoria[];
  onAdd: (data: { nome: string; descricao: string }) => Promise<any>;
  onUpdate: (id: number, data: { nome: string; descricao: string }) => Promise<any>;
  onDelete: (id: number) => Promise<any>;
}

export function CategoriasContent({
  categorias,
  onAdd,
  onUpdate,
  onDelete
}: CategoriasContentProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Categoria | null>(null);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpenAdd = () => {
    setEditingCat(null);
    setNome("");
    setDescricao("");
    setFormOpen(true);
  };

  const handleOpenEdit = (cat: Categoria) => {
    setEditingCat(cat);
    setNome(cat.nome);
    setDescricao(cat.descricao);
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCat) {
        await onUpdate(editingCat.id, { nome, descricao });
        toast.success("Categoria atualizada com sucesso!");
      } else {
        await onAdd({ nome, descricao });
        toast.success("Categoria criada com sucesso!");
      }
      setFormOpen(false);
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar a categoria.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja realmente excluir esta categoria?")) {
      try {
        await onDelete(id);
        toast.success("Categoria excluída com sucesso!");
      } catch (error) {
        toast.error("Erro ao excluir. Verifique se existem frutas vinculadas.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Categorias
          </h2>
          <p className="mt-1 text-muted-foreground">
            Gerencie as categorias para organizar seu estoque.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categorias.map((cat) => (
          <div
            key={cat.id}
            className="group relative flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md hover:border-primary/50"
          >
            <div className="rounded-lg bg-primary/10 p-2.5 transition-colors group-hover:bg-primary/20">
              <Tags className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 pr-8">
              <h3 className="font-semibold text-card-foreground">
                {cat.nome}
              </h3>
              {cat.descricao && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {cat.descricao}
                </p>
              )}
              <div className="mt-4 flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                  {cat.quantidade_frutas} frutas
                </span>
              </div>
            </div>

            <div className="absolute right-3 top-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleOpenEdit(cat)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(cat.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}

        {categorias.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
            <Tags className="h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 font-semibold text-muted-foreground">Nenhuma categoria encontrada</h3>
            <p className="text-sm text-muted-foreground">Comece criando sua primeira categoria.</p>
          </div>
        )}
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingCat ? "Editar Categoria" : "Nova Categoria"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 py-2">
            <div className="grid gap-2">
              <Label htmlFor="cat-nome" className="text-sm font-medium">Nome</Label>
              <Input
                id="cat-nome"
                placeholder="Ex: Frutas Tropicais"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="bg-muted/50 focus:bg-background"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cat-desc" className="text-sm font-medium">Descrição</Label>
              <Textarea
                id="cat-desc"
                placeholder="Descreva esta categoria..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={4}
                className="bg-muted/50 focus:bg-background"
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0 font-sans">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {loading ? "Salvando..." : editingCat ? "Salvar Alterações" : "Criar Categoria"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
