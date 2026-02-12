"use client";

import { useState, useCallback } from "react";
import type {
  Dashboard,
  FrutaResumo,
  Fruta,
  Categoria,
  FrutaFormData,
} from "@/lib/api";

// Demo data for standalone frontend preview
const demoCategorias: Categoria[] = [
  {
    id: 1,
    nome: "Citricas",
    descricao: "Frutas citricas",
    quantidade_frutas: 3,
    criado_em: "2026-01-01T00:00:00Z",
    atualizado_em: "2026-01-01T00:00:00Z",
  },
  {
    id: 2,
    nome: "Tropicais",
    descricao: "Frutas tropicais",
    quantidade_frutas: 4,
    criado_em: "2026-01-01T00:00:00Z",
    atualizado_em: "2026-01-01T00:00:00Z",
  },
  {
    id: 3,
    nome: "Vermelhas",
    descricao: "Frutas vermelhas",
    quantidade_frutas: 2,
    criado_em: "2026-01-01T00:00:00Z",
    atualizado_em: "2026-01-01T00:00:00Z",
  },
];

const initialFrutas: (FrutaResumo & {
  descricao: string;
  fornecedor: string;
  estoque_minimo: number;
  ativo: boolean;
  categoria: number;
  dias_para_vencer: number;
  esta_vencida: boolean;
})[] = [
  {
    id: 1,
    nome: "Laranja Pera",
    categoria: 1,
    categoria_nome: "Citricas",
    preco: "4.50",
    quantidade: 120,
    unidade: "kg",
    data_validade: "2026-02-20",
    status_validade: "ok",
    estoque_baixo: false,
    descricao: "Laranja pera de primeira",
    fornecedor: "Fazenda Boa Vista",
    estoque_minimo: 20,
    ativo: true,
    dias_para_vencer: 9,
    esta_vencida: false,
  },
  {
    id: 2,
    nome: "Banana Prata",
    categoria: 2,
    categoria_nome: "Tropicais",
    preco: "5.99",
    quantidade: 80,
    unidade: "kg",
    data_validade: "2026-02-14",
    status_validade: "atencao",
    estoque_baixo: false,
    descricao: "Banana prata madura",
    fornecedor: "Sitio do Joao",
    estoque_minimo: 15,
    ativo: true,
    dias_para_vencer: 3,
    esta_vencida: false,
  },
  {
    id: 3,
    nome: "Morango",
    categoria: 3,
    categoria_nome: "Vermelhas",
    preco: "18.90",
    quantidade: 8,
    unidade: "cx",
    data_validade: "2026-02-12",
    status_validade: "critico",
    estoque_baixo: true,
    descricao: "Morango organico",
    fornecedor: "Horta Feliz",
    estoque_minimo: 10,
    ativo: true,
    dias_para_vencer: 1,
    esta_vencida: false,
  },
  {
    id: 4,
    nome: "Manga Tommy",
    categoria: 2,
    categoria_nome: "Tropicais",
    preco: "7.50",
    quantidade: 45,
    unidade: "kg",
    data_validade: "2026-02-25",
    status_validade: "ok",
    estoque_baixo: false,
    descricao: "Manga tommy importada",
    fornecedor: "Distribuidora Frutal",
    estoque_minimo: 10,
    ativo: true,
    dias_para_vencer: 14,
    esta_vencida: false,
  },
  {
    id: 5,
    nome: "Limao Tahiti",
    categoria: 1,
    categoria_nome: "Citricas",
    preco: "3.20",
    quantidade: 5,
    unidade: "kg",
    data_validade: "2026-02-18",
    status_validade: "ok",
    estoque_baixo: true,
    descricao: "Limao tahiti verde",
    fornecedor: "Fazenda Boa Vista",
    estoque_minimo: 15,
    ativo: true,
    dias_para_vencer: 7,
    esta_vencida: false,
  },
  {
    id: 6,
    nome: "Abacaxi Perola",
    categoria: 2,
    categoria_nome: "Tropicais",
    preco: "6.00",
    quantidade: 30,
    unidade: "un",
    data_validade: "2026-02-22",
    status_validade: "ok",
    estoque_baixo: false,
    descricao: "Abacaxi perola doce",
    fornecedor: "Sitio do Joao",
    estoque_minimo: 10,
    ativo: true,
    dias_para_vencer: 11,
    esta_vencida: false,
  },
  {
    id: 7,
    nome: "Uva Italia",
    categoria: 3,
    categoria_nome: "Vermelhas",
    preco: "14.00",
    quantidade: 25,
    unidade: "kg",
    data_validade: "2026-02-10",
    status_validade: "vencido",
    estoque_baixo: false,
    descricao: "Uva italia sem semente",
    fornecedor: "Vinicola Sul",
    estoque_minimo: 8,
    ativo: true,
    dias_para_vencer: -1,
    esta_vencida: true,
  },
  {
    id: 8,
    nome: "Mamao Formosa",
    categoria: 2,
    categoria_nome: "Tropicais",
    preco: "8.50",
    quantidade: 18,
    unidade: "un",
    data_validade: "2026-02-16",
    status_validade: "atencao",
    estoque_baixo: false,
    descricao: "Mamao formosa grande",
    fornecedor: "Distribuidora Frutal",
    estoque_minimo: 10,
    ativo: true,
    dias_para_vencer: 5,
    esta_vencida: false,
  },
];

export function useFrutmaxData() {
  const [frutas, setFrutas] = useState(initialFrutas);
  const [categorias] = useState(demoCategorias);
  const [nextId, setNextId] = useState(9);

  const dashboard: Dashboard = {
    total_frutas: frutas.filter((f) => f.ativo).length,
    total_categorias: categorias.length,
    estoque_total: frutas
      .filter((f) => f.ativo)
      .reduce((sum, f) => sum + f.quantidade, 0),
    frutas_vencidas: frutas.filter(
      (f) => f.ativo && f.status_validade === "vencido"
    ).length,
    frutas_vencendo: frutas.filter(
      (f) =>
        f.ativo &&
        (f.status_validade === "atencao" || f.status_validade === "critico")
    ).length,
    estoque_baixo: frutas.filter((f) => f.ativo && f.estoque_baixo).length,
    valor_total_estoque: frutas
      .filter((f) => f.ativo)
      .reduce((sum, f) => sum + Number(f.preco) * f.quantidade, 0)
      .toFixed(2),
  };

  const addFruta = useCallback(
    (data: FrutaFormData) => {
      const cat = categorias.find((c) => c.id === data.categoria);
      const today = new Date();
      const validade = new Date(data.data_validade);
      const diffDays = Math.ceil(
        (validade.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      let statusValidade: "ok" | "atencao" | "critico" | "vencido" = "ok";
      if (diffDays < 0) statusValidade = "vencido";
      else if (diffDays <= 3) statusValidade = "critico";
      else if (diffDays <= 7) statusValidade = "atencao";

      const newFruta = {
        id: nextId,
        nome: data.nome,
        categoria: data.categoria || 0,
        categoria_nome: cat?.nome || "",
        preco: data.preco,
        quantidade: data.quantidade,
        unidade: data.unidade,
        data_validade: data.data_validade,
        status_validade: statusValidade,
        estoque_baixo: data.quantidade <= data.estoque_minimo,
        descricao: data.descricao,
        fornecedor: data.fornecedor,
        estoque_minimo: data.estoque_minimo,
        ativo: data.ativo,
        dias_para_vencer: diffDays,
        esta_vencida: diffDays < 0,
      };
      setFrutas((prev) => [...prev, newFruta]);
      setNextId((prev) => prev + 1);
    },
    [categorias, nextId]
  );

  const updateFruta = useCallback(
    (id: number, data: FrutaFormData) => {
      const cat = categorias.find((c) => c.id === data.categoria);
      const today = new Date();
      const validade = new Date(data.data_validade);
      const diffDays = Math.ceil(
        (validade.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      let statusValidade: "ok" | "atencao" | "critico" | "vencido" = "ok";
      if (diffDays < 0) statusValidade = "vencido";
      else if (diffDays <= 3) statusValidade = "critico";
      else if (diffDays <= 7) statusValidade = "atencao";

      setFrutas((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                nome: data.nome,
                categoria: data.categoria || 0,
                categoria_nome: cat?.nome || "",
                preco: data.preco,
                quantidade: data.quantidade,
                unidade: data.unidade,
                data_validade: data.data_validade,
                fornecedor: data.fornecedor,
                estoque_minimo: data.estoque_minimo,
                ativo: data.ativo,
                descricao: data.descricao,
                status_validade: statusValidade,
                estoque_baixo: data.quantidade <= data.estoque_minimo,
                dias_para_vencer: diffDays,
                esta_vencida: diffDays < 0,
              }
            : f
        )
      );
    },
    [categorias]
  );

  const deleteFruta = useCallback((id: number) => {
    setFrutas((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const getFruta = useCallback(
    (id: number): Fruta | null => {
      const f = frutas.find((fr) => fr.id === id);
      if (!f) return null;
      return {
        ...f,
        criado_em: "2026-01-01T00:00:00Z",
        atualizado_em: "2026-01-01T00:00:00Z",
      };
    },
    [frutas]
  );

  return {
    dashboard,
    frutas: frutas.filter((f) => f.ativo) as FrutaResumo[],
    allFrutas: frutas,
    categorias,
    addFruta,
    updateFruta,
    deleteFruta,
    getFruta,
  };
}
