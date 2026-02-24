"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Fruta, Categoria, Fornecedor, FrutaFormData } from "@/lib/api";

interface FrutaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fruta?: Fruta | null;
  categorias: Categoria[];
  fornecedores: Fornecedor[];
  onSubmit: (data: FrutaFormData) => void;
  loading?: boolean;
}

export function FrutaFormDialog({
  open,
  onOpenChange,
  fruta,
  categorias,
  fornecedores = [],
  onSubmit,
  loading,
}: FrutaFormDialogProps) {
  const [formData, setFormData] = useState<FrutaFormData>({
    nome: "",
    categoria: null,
    descricao: "",
    preco: "",
    quantidade: 0,
    unidade: "kg",
    data_validade: "",
    fornecedor: null,
    estoque_minimo: 10,
    ativo: true,
  });

  useEffect(() => {
    if (fruta) {
      setFormData({
        nome: fruta.nome,
        categoria: fruta.categoria,
        descricao: fruta.descricao,
        preco: fruta.preco,
        quantidade: fruta.quantidade,
        unidade: fruta.unidade,
        data_validade: fruta.data_validade,
        fornecedor: fruta.fornecedor,
        estoque_minimo: fruta.estoque_minimo,
        ativo: fruta.ativo,
      });
    } else {
      setFormData({
        nome: "",
        categoria: null,
        descricao: "",
        preco: "",
        quantidade: 0,
        unidade: "kg",
        data_validade: "",
        fornecedor: null,
        estoque_minimo: 10,
        ativo: true,
      });
    }
  }, [fruta, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg bg-card font-sans">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {fruta ? "Editar Fruta" : "Cadastrar Nova Fruta"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nome" className="font-semibold text-sm">Nome do Produto</Label>
            <Input
              id="nome"
              placeholder="Ex: Banana Prata"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
              required
              className="bg-muted/50 focus:bg-background h-11"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="categoria" className="font-semibold text-sm">Categoria</Label>
              <Select
                value={formData.categoria?.toString() || ""}
                onValueChange={(v) =>
                  setFormData({
                    ...formData,
                    categoria: v ? Number(v) : null,
                  })
                }
              >
                <SelectTrigger className="bg-muted/50 h-11">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="unidade" className="font-semibold text-sm">Unidade de Medida</Label>
              <Select
                value={formData.unidade}
                onValueChange={(v) =>
                  setFormData({ ...formData, unidade: v })
                }
              >
                <SelectTrigger className="bg-muted/50 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Quilograma (kg)</SelectItem>
                  <SelectItem value="un">Unidade (un)</SelectItem>
                  <SelectItem value="cx">Caixa (cx)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="preco" className="font-semibold text-sm">{"Preço por Unidade (R$)"}</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.preco}
                onChange={(e) =>
                  setFormData({ ...formData, preco: e.target.value })
                }
                required
                className="bg-muted/50 h-11"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantidade" className="font-semibold text-sm">Estoque Inicial</Label>
              <Input
                id="quantidade"
                type="number"
                min="0"
                value={formData.quantidade}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantidade: Number(e.target.value),
                  })
                }
                required
                className="bg-muted/50 h-11"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="data_validade" className="font-semibold text-sm">Data de Validade</Label>
              <Input
                id="data_validade"
                type="date"
                value={formData.data_validade}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    data_validade: e.target.value,
                  })
                }
                required
                className="bg-muted/50 h-11"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="estoque_minimo" className="font-semibold text-sm">Estoque Mínimo (Alerta)</Label>
              <Input
                id="estoque_minimo"
                type="number"
                min="0"
                value={formData.estoque_minimo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estoque_minimo: Number(e.target.value),
                  })
                }
                className="bg-muted/50 h-11"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fornecedor" className="font-semibold text-sm">Fornecedor</Label>
            <Select
              value={formData.fornecedor?.toString() || ""}
              onValueChange={(v) =>
                setFormData({
                  ...formData,
                  fornecedor: v ? Number(v) : null,
                })
              }
            >
              <SelectTrigger className="bg-muted/50 h-11">
                <SelectValue placeholder="Selecione um fornecedor" />
              </SelectTrigger>
              <SelectContent>
                {fornecedores.map((forn) => (
                  <SelectItem key={forn.id} value={forn.id.toString()}>
                    {forn.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="descricao" className="font-semibold text-sm">Detalhes Adicionais</Label>
            <Textarea
              id="descricao"
              placeholder="Descreva lote, características ou observações..."
              value={formData.descricao}
              onChange={(e) =>
                setFormData({ ...formData, descricao: e.target.value })
              }
              rows={3}
              className="bg-muted/50 focus:bg-background"
            />
          </div>

          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="h-11 bg-primary hover:bg-primary/90">
              {loading ? "Salvando..." : fruta ? "Salvar Alterações" : "Cadastrar Produto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
