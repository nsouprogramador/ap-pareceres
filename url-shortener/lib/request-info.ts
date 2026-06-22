/**
 * lib/request-info.ts
 * Extrai metadados de telemetria de uma requisição (user-agent + geolocalização)
 * para registrar estatísticas de clique. Armazenamos apenas o necessário.
 */
import { UAParser } from "ua-parser-js";
import { getClientIp } from "./rate-limit";

export interface ClickMeta {
  ip: string;
  city: string | null;
  country: string | null;
  browser: string | null;
  os: string | null;
  device: string | null;
  referer: string | null;
  userAgent: string | null;
}

export function extractClickMeta(req: Request): ClickMeta {
  const headers = req.headers;
  const userAgent = headers.get("user-agent");
  const parser = new UAParser(userAgent ?? undefined);
  const ua = parser.getResult();

  return {
    ip: getClientIp(headers),
    // Vercel injeta geolocalização via headers; em outros hosts ficam nulos.
    city: decodeHeader(headers.get("x-vercel-ip-city")),
    country: headers.get("x-vercel-ip-country"),
    browser: ua.browser.name ?? null,
    os: ua.os.name ?? null,
    device: ua.device.type ?? "desktop",
    referer: headers.get("referer"),
    userAgent: userAgent ?? null,
  };
}

function decodeHeader(value: string | null): string | null {
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
