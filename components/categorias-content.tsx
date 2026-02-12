"use client";

import React from "react"

import { useState } from "react";
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
import { Plus, Tags } from "lucide-react";
import type { Categoria } from "@/lib/api";

interface CategoriasContentProps {
  categorias: Categoria[];
}

export function CategoriasContent({ categorias }: CategoriasContentProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [items, setItems] = useState(categorias);
  const [nextId, setNextId] = useState(categorias.length + 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCat: Categoria = {
      id: nextId,
      nome,
      descricao,
      quantidade_frutas: 0,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString(),
    };
    setItems((prev) => [...prev, newCat]);
    setNextId((prev) => prev + 1);
    setNome("");
    setDescricao("");
    setFormOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Categorias
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Organize as frutas por categorias
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((cat) => (
          <div
            key={cat.id}
            className="flex items-start gap-4 rounded-xl border border-border bg-card p-5"
          >
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Tags className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-card-foreground">
                {cat.nome}
              </h3>
              {cat.descricao && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {cat.descricao}
                </p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                {cat.quantidade_frutas} frutas cadastradas
              </p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">
              Nova Categoria
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="cat-nome">Nome</Label>
              <Input
                id="cat-nome"
                placeholder="Ex: Tropicais"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="cat-desc">Descricao</Label>
              <Textarea
                id="cat-desc"
                placeholder="Descricao da categoria..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Criar Categoria</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
