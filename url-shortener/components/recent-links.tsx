"use client";

/**
 * components/recent-links.tsx
 * Lista os últimos links criados pelo visitante, persistidos no localStorage
 * (não requer autenticação). Atualiza-se ao receber o evento global emitido
 * pelo formulário de encurtamento.
 */
import * as React from "react";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";
import { QrCodeDialog } from "@/components/qr-code";
import { prettyUrl } from "@/utils/format";
import type { LinkDTO } from "@/types";

const STORAGE_KEY = "linkly:recent";
const MAX_ITEMS = 5;

type RecentLink = Pick<LinkDTO, "id" | "slug" | "shortUrl" | "originalUrl">;

export function addRecentLink(link: LinkDTO) {
  if (typeof window === "undefined") return;
  const current = readRecent();
  const next = [
    { id: link.id, slug: link.slug, shortUrl: link.shortUrl, originalUrl: link.originalUrl },
    ...current.filter((l) => l.id !== link.id),
  ].slice(0, MAX_ITEMS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function readRecent(): RecentLink[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as RecentLink[];
  } catch {
    return [];
  }
}

export function RecentLinks() {
  const [links, setLinks] = React.useState<RecentLink[]>([]);

  React.useEffect(() => {
    const update = () => setLinks(readRecent());
    update();
    window.addEventListener("recent-links-updated", update);
    return () => window.removeEventListener("recent-links-updated", update);
  }, []);

  if (links.length === 0) return null;

  return (
    <section className="mx-auto mt-10 w-full max-w-2xl">
      <h2 className="mb-3 text-sm font-medium text-muted-foreground">
        Seus últimos links
      </h2>
      <div className="space-y-2">
        {links.map((link) => (
          <Card key={link.id} className="animate-fade-in">
            <CardContent className="flex items-center gap-3 p-3">
              <div className="min-w-0 flex-1">
                <a
                  href={link.shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 truncate font-medium text-primary hover:underline"
                >
                  {link.shortUrl.replace(/^https?:\/\//, "")}
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
                <p className="truncate text-xs text-muted-foreground">
                  {prettyUrl(link.originalUrl, 50)}
                </p>
              </div>
              <CopyButton value={link.shortUrl} variant="ghost" size="icon" />
              <QrCodeDialog url={link.shortUrl} />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
