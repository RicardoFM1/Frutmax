const rawApiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function normalizeApiBaseUrl(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}

const API_BASE_URL = normalizeApiBaseUrl(rawApiBaseUrl);

export interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  quantidade_frutas: number;
  criado_em: string;
  atualizado_em: string;
}

export interface Fornecedor {
  id: number;
  nome: string;
  email: string | null;
  telefone: string;
  endereco: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface Fruta {
  id: number;
  nome: string;
  categoria: number | null;
  categoria_nome: string;
  descricao: string;
  preco: string;
  quantidade: number;
  unidade: "kg" | "un" | "cx";
  data_validade: string;
  fornecedor: number | null;
  fornecedor_nome: string;
  estoque_minimo: number;
  ativo: boolean;
  esta_vencida: boolean;
  dias_para_vencer: number;
  estoque_baixo: boolean;
  status_validade: "ok" | "atencao" | "critico" | "vencido";
  criado_em: string;
  atualizado_em: string;
}

export interface FrutaResumo {
  id: number;
  nome: string;
  categoria_nome: string;
  preco: string;
  quantidade: number;
  unidade: string;
  data_validade: string;
  status_validade: "ok" | "atencao" | "critico" | "vencido";
  estoque_baixo: boolean;
}

export interface Dashboard {
  total_frutas: number;
  total_categorias: number;
  estoque_total: number;
  frutas_vencidas: number;
  frutas_vencendo: number;
  estoque_baixo: number;
  valor_total_estoque: string;
  estoque_por_unidade: Record<string, number>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface FrutaFormData {
  nome: string;
  categoria: number | null;
  descricao: string;
  preco: string;
  quantidade: number;
  unidade: string;
  data_validade: string;
  fornecedor: number | null;
  estoque_minimo: number;
  ativo: boolean;
}

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.detail || `Erro na requisicao: ${res.status}`
    );
  }

  if (res.status === 204) return {} as T;
  return res.json();
}

export const api = {
  dashboard: () => apiFetch<Dashboard>("/dashboard/"),

  frutas: {
    list: (params?: string) =>
      apiFetch<PaginatedResponse<FrutaResumo>>(
        `/frutas/${params ? `?${params}` : ""}`
      ),
    get: (id: number) => apiFetch<Fruta>(`/frutas/${id}/`),
    create: (data: FrutaFormData) =>
      apiFetch<Fruta>("/frutas/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: FrutaFormData) =>
      apiFetch<Fruta>(`/frutas/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      apiFetch<void>(`/frutas/${id}/`, { method: "DELETE" }),
    vencidas: () => apiFetch<FrutaResumo[]>("/frutas/vencidas/"),
    vencendo: () => apiFetch<FrutaResumo[]>("/frutas/vencendo/"),
    estoqueBaixo: () =>
      apiFetch<FrutaResumo[]>("/frutas/estoque_baixo/"),
  },

  categorias: {
    list: () => apiFetch<PaginatedResponse<Categoria>>("/categorias/"),
    get: (id: number) => apiFetch<Categoria>(`/categorias/${id}/`),
    create: (data: { nome: string; descricao: string }) =>
      apiFetch<Categoria>("/categorias/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: { nome: string; descricao: string }) =>
      apiFetch<Categoria>(`/categorias/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      apiFetch<void>(`/categorias/${id}/`, { method: "DELETE" }),
  },

  fornecedores: {
    list: (params?: string) =>
      apiFetch<PaginatedResponse<Fornecedor>>(
        `/fornecedores/${params ? `?${params}` : ""}`
      ),
    get: (id: number) => apiFetch<Fornecedor>(`/fornecedores/${id}/`),
    create: (data: Partial<Fornecedor>) =>
      apiFetch<Fornecedor>("/fornecedores/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Fornecedor>) =>
      apiFetch<Fornecedor>(`/fornecedores/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      apiFetch<void>(`/fornecedores/${id}/`, { method: "DELETE" }),
  },
};
