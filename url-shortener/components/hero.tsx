/**
 * components/hero.tsx
 * Seção principal da landing page com chamada e o formulário de encurtamento.
 */
import { Badge } from "@/components/ui/badge";
import { UrlShortenerForm } from "@/components/url-shortener-form";
import { RecentLinks } from "@/components/recent-links";

export function Hero() {
  return (
    <section className="hero-gradient relative overflow-hidden pb-12 pt-16 sm:pt-24">
      <div className="container flex flex-col items-center text-center">
        <Badge variant="default" className="mb-4 animate-fade-in">
          ✨ Encurte, compartilhe e acompanhe
        </Badge>
        <h1 className="max-w-3xl animate-fade-in text-4xl font-bold tracking-tight sm:text-6xl">
          Links curtos.{" "}
          <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Resultados grandes.
          </span>
        </h1>
        <p className="mt-5 max-w-xl animate-fade-in text-lg text-muted-foreground">
          Transforme URLs longas em links curtos e elegantes. Gere QR Codes,
          acompanhe cliques e gerencie tudo em um painel moderno.
        </p>

        <div className="mt-10 w-full">
          <UrlShortenerForm />
          <RecentLinks />
        </div>
      </div>
    </section>
  );
}
