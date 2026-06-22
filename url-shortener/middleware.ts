/**
 * middleware.ts
 * - Aplica headers de segurança (Helmet-like) a todas as respostas.
 * - Aplica rate limiting às rotas de API mutáveis.
 * - Protege rotas do /dashboard exigindo sessão autenticada.
 */
import { NextResponse, type NextRequest } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-DNS-Prefetch-Control": "on",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
};

function withSecurityHeaders(res: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(key, value);
  }
  return res;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rate limit nas rotas de API que criam/alteram dados.
  const isMutatingApi =
    pathname.startsWith("/api/shorten") ||
    pathname.startsWith("/api/auth/register") ||
    (pathname.startsWith("/api/links") && req.method !== "GET");

  if (isMutatingApi) {
    const ip = getClientIp(req.headers);
    const { success, limit, remaining, reset } = rateLimit(
      `${ip}:${pathname}`,
      20,
      60_000,
    );
    if (!success) {
      const res = NextResponse.json(
        { success: false, error: "Muitas requisições. Tente novamente em instantes." },
        { status: 429 },
      );
      res.headers.set("Retry-After", Math.ceil((reset - Date.now()) / 1000).toString());
      return withSecurityHeaders(res);
    }
    const res = NextResponse.next();
    res.headers.set("X-RateLimit-Limit", limit.toString());
    res.headers.set("X-RateLimit-Remaining", remaining.toString());
    return withSecurityHeaders(res);
  }

  // Proteção de rotas autenticadas. A presença do cookie de sessão é checada
  // aqui; a validação criptográfica ocorre nos handlers via `auth()`.
  if (pathname.startsWith("/dashboard")) {
    const hasSession =
      req.cookies.has("authjs.session-token") ||
      req.cookies.has("__Secure-authjs.session-token");
    if (!hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("callbackUrl", pathname);
      return withSecurityHeaders(NextResponse.redirect(url));
    }
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  // Aplica a tudo exceto assets estáticos do Next.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|svg|webp|ico)$).*)"],
};
