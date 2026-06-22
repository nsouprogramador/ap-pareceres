/**
 * types/index.ts
 * Tipos de domínio compartilhados entre servidor e cliente (DTOs serializáveis).
 */
import type { Link } from "@prisma/client";

/** Versão serializável de um link (datas como ISO string) + URL curta pronta. */
export interface LinkDTO {
  id: string;
  slug: string;
  originalUrl: string;
  shortUrl: string;
  active: boolean;
  clicks: number;
  expirationDate: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
  isExpired: boolean;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardSummary {
  totalLinks: number;
  totalClicks: number;
  clicksToday: number;
  clicksThisMonth: number;
}

export interface TimeSeriesPoint {
  date: string; // YYYY-MM-DD
  clicks: number;
}

export interface BreakdownPoint {
  label: string;
  value: number;
}

export interface TopLink {
  id: string;
  slug: string;
  originalUrl: string;
  clicks: number;
}

export interface DashboardStats {
  summary: DashboardSummary;
  clicksByDay: TimeSeriesPoint[];
  topLinks: TopLink[];
  browsers: BreakdownPoint[];
  os: BreakdownPoint[];
  devices: BreakdownPoint[];
  countries: BreakdownPoint[];
}

export interface LinkStats {
  link: LinkDTO;
  totalClicks: number;
  clicksByDay: TimeSeriesPoint[];
  browsers: BreakdownPoint[];
  os: BreakdownPoint[];
  devices: BreakdownPoint[];
  countries: BreakdownPoint[];
  referers: BreakdownPoint[];
}

export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = { success: false; error: string; details?: unknown };
export type ApiResult<T> = ApiSuccess<T> | ApiError;

export function isExpired(date: Date | string | null): boolean {
  if (!date) return false;
  return new Date(date).getTime() < Date.now();
}

/** Converte uma entidade Link do Prisma em DTO serializável. */
export function toLinkDTO(link: Link, appUrl: string): LinkDTO {
  return {
    id: link.id,
    slug: link.slug,
    originalUrl: link.originalUrl,
    shortUrl: `${appUrl.replace(/\/+$/, "")}/${link.slug}`,
    active: link.active,
    clicks: link.clicks,
    expirationDate: link.expirationDate?.toISOString() ?? null,
    createdAt: link.createdAt.toISOString(),
    updatedAt: link.updatedAt.toISOString(),
    userId: link.userId,
    isExpired: isExpired(link.expirationDate),
  };
}
