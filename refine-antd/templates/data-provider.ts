/**
 * Hand-rolled REST data provider skeleton.
 *
 * Prefer an official adapter (@refinedev/simple-rest, @refinedev/graphql,
 * @refinedev/supabase, ...) when the backend matches one — only hand-roll
 * when the API shape is bespoke. Implement getMany for real (don't leave the
 * N+1 fallback) if any table resolves a relation column.
 */
import type { DataProvider } from "@refinedev/core";

const API_URL = "https://api.example.com";

const fetchJson = async (url: string, init?: RequestInit) => {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (response.status < 200 || response.status > 299) throw response;
  return response.json();
};

export const dataProvider: DataProvider = {
  getApiUrl: () => API_URL,

  getList: async ({ resource, pagination, sorters, filters }) => {
    const params = new URLSearchParams();
    if (pagination) {
      params.append("_start", String(((pagination.currentPage ?? 1) - 1) * (pagination.pageSize ?? 10)));
      params.append("_end", String((pagination.currentPage ?? 1) * (pagination.pageSize ?? 10)));
    }
    sorters?.forEach((s) => {
      params.append("_sort", s.field);
      params.append("_order", s.order);
    });
    filters?.forEach((f) => {
      if ("field" in f) params.append(f.field, String(f.value));
    });

    const response = await fetch(`${API_URL}/${resource}?${params.toString()}`);
    if (response.status < 200 || response.status > 299) throw response;
    const data = await response.json();
    const total = Number(response.headers.get("x-total-count")) || data.length;
    return { data, total };
  },

  getOne: async ({ resource, id }) => {
    const data = await fetchJson(`${API_URL}/${resource}/${id}`);
    return { data };
  },

  getMany: async ({ resource, ids }) => {
    const params = new URLSearchParams();
    ids.forEach((id) => params.append("id", String(id)));
    const data = await fetchJson(`${API_URL}/${resource}?${params.toString()}`);
    return { data };
  },

  create: async ({ resource, variables }) => {
    const data = await fetchJson(`${API_URL}/${resource}`, {
      method: "POST",
      body: JSON.stringify(variables),
    });
    return { data };
  },

  update: async ({ resource, id, variables }) => {
    const data = await fetchJson(`${API_URL}/${resource}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(variables),
    });
    return { data };
  },

  deleteOne: async ({ resource, id }) => {
    const data = await fetchJson(`${API_URL}/${resource}/${id}`, { method: "DELETE" });
    return { data };
  },

  // Optional — implement when a non-CRUD endpoint is needed (useCustom/useCustomMutation).
  custom: async ({ url, method, payload }) => {
    const data = await fetchJson(url, {
      method: method.toUpperCase(),
      body: payload ? JSON.stringify(payload) : undefined,
    });
    return { data };
  },
};
