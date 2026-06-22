/**
 * lib/rate-limit.ts
 * Rate limiter simples baseado em janela deslizante em memória.
 * Suficiente para uma única instância / deploy serverless de baixo volume.
 * Para escala horizontal, troque o Map por Redis (Upstash) mantendo a mesma API.
 */
type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // epoch ms
}

export function rateLimit(
  key: string,
  limit = 20,
  windowMs = 60_000,
): RateLimitResult {
  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || bucket.resetAt < now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { success: true, limit, remaining: limit - 1, reset: resetAt };
  }

  bucket.count += 1;
  const remaining = Math.max(0, limit - bucket.count);
  return {
    success: bucket.count <= limit,
    limit,
    remaining,
    reset: bucket.resetAt,
  };
}

/** Extrai o IP do cliente a partir dos headers de proxy (Vercel/edge). */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "127.0.0.1";
}

// Limpeza periódica de buckets expirados (evita crescimento indefinido).
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of store) if (v.resetAt < now) store.delete(k);
  }, 5 * 60_000).unref?.();
}
