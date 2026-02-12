"use client";

import React from "react"

import { useState, useEffect } from "react";
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
import type { Fruta, Categoria, FrutaFormData } from "@/lib/api";

interface FrutaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fruta?: Fruta | null;
  categorias: Categoria[];
  onSubmit: (data: FrutaFormData) => void;
  loading?: boolean;
}

export function FrutaFormDialog({
  open,
  onOpenChange,
  fruta,
  categorias,
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
    fornecedor: "",
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
        fornecedor: "",
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">
            {fruta ? "Editar Fruta" : "Cadastrar Nova Fruta"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nome">Nome da Fruta</Label>
            <Input
              id="nome"
              placeholder="Ex: Banana Prata"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select
                value={formData.categoria?.toString() || ""}
                onValueChange={(v) =>
                  setFormData({
                    ...formData,
                    categoria: v ? Number(v) : null,
                  })
                }
              >
                <SelectTrigger>
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
            <div className="flex flex-col gap-2">
              <Label htmlFor="unidade">Unidade</Label>
              <Select
                value={formData.unidade}
                onValueChange={(v) =>
                  setFormData({ ...formData, unidade: v })
                }
              >
                <SelectTrigger>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="preco">{"Preco (R$)"}</Label>
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
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="quantidade">Quantidade</Label>
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
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="data_validade">Data de Validade</Label>
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
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="estoque_minimo">Estoque Minimo</Label>
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
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="fornecedor">Fornecedor</Label>
            <Input
              id="fornecedor"
              placeholder="Nome do fornecedor"
              value={formData.fornecedor}
              onChange={(e) =>
                setFormData({ ...formData, fornecedor: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="descricao">Descricao</Label>
            <Textarea
              id="descricao"
              placeholder="Observacoes sobre a fruta..."
              value={formData.descricao}
              onChange={(e) =>
                setFormData({ ...formData, descricao: e.target.value })
              }
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : fruta ? "Atualizar" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
