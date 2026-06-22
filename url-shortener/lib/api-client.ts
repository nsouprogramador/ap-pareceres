/**
 * lib/api-client.ts
 * Cliente fetch tipado para consumir a API interna a partir de componentes
 * client-side. Desempacota o envelope { success, data } e lança em caso de erro.
 */
import type { ApiResult } from "@/types";

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const json = (await res.json().catch(() => null)) as ApiResult<T> | null;

  if (!res.ok || !json || json.success === false) {
    const message =
      json && "error" in json ? json.error : `Erro ${res.status}`;
    throw new Error(message);
  }

  return json.data;
}

export const apiClient = {
  get: <T>(url: string) => request<T>(url, { method: "GET" }),
  post: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};
