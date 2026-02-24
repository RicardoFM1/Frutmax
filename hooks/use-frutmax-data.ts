"use client";

import { useState, useCallback, useEffect } from "react";
import { api, type Dashboard, type FrutaResumo, type Fruta, type Categoria, type Fornecedor, type FrutaFormData } from "@/lib/api";
import { toast } from "sonner";

export function useFrutmaxData() {
  const [frutas, setFrutas] = useState<FrutaResumo[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard>({
    total_frutas: 0,
    total_categorias: 0,
    estoque_total: 0,
    frutas_vencidas: 0,
    frutas_vencendo: 0,
    estoque_baixo: 0,
    valor_total_estoque: "0.00",
    estoque_por_unidade: {},
  });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [dashData, frutasData, catsData, fornsData] = await Promise.all([
        api.dashboard(),
        api.frutas.list(),
        api.categorias.list(),
        api.fornecedores.list(),
      ]);

      setDashboard(dashData);
      setFrutas(frutasData.results);
      setCategorias(catsData.results);
      setFornecedores(fornsData.results);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      // toast.error("Falha ao comunicar com o servidor.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- FRUTAS ---
  const addFruta = async (data: any) => {
    await api.frutas.create(data);
    await fetchData();
  };

  const updateFruta = async (id: number, data: any) => {
    await api.frutas.update(id, data);
    await fetchData();
  };

  const deleteFruta = async (id: number) => {
    await api.frutas.delete(id);
    await fetchData();
  };

  const getFruta = async (id: number) => {
    return api.frutas.get(id);
  };

  // --- CATEGORIAS ---
  const addCategoria = async (data: { nome: string; descricao: string }) => {
    await api.categorias.create(data);
    await fetchData();
  };

  const updateCategoria = async (id: number, data: { nome: string; descricao: string }) => {
    await api.categorias.update(id, data);
    await fetchData();
  };

  const deleteCategoria = async (id: number) => {
    await api.categorias.delete(id);
    await fetchData();
  };

  // --- FORNECEDORES ---
  const addFornecedor = async (data: Partial<Fornecedor>) => {
    await api.fornecedores.create(data);
    await fetchData();
  };

  const updateFornecedor = async (id: number, data: Partial<Fornecedor>) => {
    await api.fornecedores.update(id, data);
    await fetchData();
  };

  const deleteFornecedor = async (id: number) => {
    await api.fornecedores.delete(id);
    await fetchData();
  };

  return {
    dashboard,
    frutas,
    categorias,
    fornecedores,
    loading,
    refresh: fetchData,
    // Frutas
    addFruta,
    updateFruta,
    deleteFruta,
    getFruta,
    // Categorias
    addCategoria,
    updateCategoria,
    deleteCategoria,
    // Fornecedores
    addFornecedor,
    updateFornecedor,
    deleteFornecedor,
  };
}
