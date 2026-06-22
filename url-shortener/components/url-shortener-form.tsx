"use client";

/**
 * components/url-shortener-form.tsx
 * Formulário principal de encurtamento. Valida a URL com Zod no cliente,
 * envia para /api/shorten, exibe o resultado com copiar/QR e persiste os
 * últimos links localmente (para visitantes não autenticados).
 */
import * as React from "react";
import { Loader2, Sparkles, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";
import { QrCodeDialog } from "@/components/qr-code";
import { apiClient } from "@/lib/api-client";
import { createLinkSchema } from "@/lib/validations";
import { prettyUrl } from "@/utils/format";
import type { LinkDTO } from "@/types";
import { addRecentLink } from "@/components/recent-links";

export function UrlShortenerForm() {
  const [url, setUrl] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<LinkDTO | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);

    const parsed = createLinkSchema.safeParse({
      originalUrl: url,
      slug: slug.trim() || undefined,
    });
    if (!parsed.success) {
      const first =
        parsed.error.flatten().fieldErrors.originalUrl?.[0] ??
        parsed.error.flatten().fieldErrors.slug?.[0] ??
        "Dados inválidos.";
      toast.error(first);
      return;
    }

    setLoading(true);
    try {
      const link = await apiClient.post<LinkDTO>("/api/shorten", parsed.data);
      setResult(link);
      addRecentLink(link);
      window.dispatchEvent(new Event("recent-links-updated"));
      toast.success("Link encurtado com sucesso!");
      setUrl("");
      setSlug("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao encurtar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Card className="border-2 shadow-xl">
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                type="text"
                inputMode="url"
                placeholder="Cole sua URL longa aqui..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-12 flex-1 text-base"
                aria-label="URL de destino"
                autoFocus
              />
              <Button type="submit" size="lg" className="h-12" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                Encurtar
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
              />
              Personalizar slug
            </button>

            {showAdvanced && (
              <div className="animate-fade-in space-y-1.5">
                <Label htmlFor="slug">Slug personalizado (opcional)</Label>
                <div className="flex items-center rounded-md border bg-background">
                  <span className="px-3 text-sm text-muted-foreground">/</span>
                  <input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="meu-link"
                    className="h-10 flex-1 bg-transparent pr-3 text-sm outline-none"
                  />
                </div>
              </div>
            )}
          </form>

          {result && (
            <div className="mt-6 animate-fade-in rounded-lg border bg-muted/40 p-4">
              <p className="text-xs text-muted-foreground">
                {prettyUrl(result.originalUrl, 60)}
              </p>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={result.shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 truncate text-lg font-semibold text-primary hover:underline"
                >
                  {result.shortUrl.replace(/^https?:\/\//, "")}
                </a>
                <div className="flex items-center gap-2">
                  <CopyButton value={result.shortUrl} label="Copiar" variant="default" />
                  <QrCodeDialog url={result.shortUrl} />
                </div>
              </div>
              {result.expirationDate && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Link temporário — crie uma conta para links permanentes.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
