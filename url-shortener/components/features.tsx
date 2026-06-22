/**
 * components/features.tsx
 * Grade de recursos destacados da plataforma.
 */
import { BarChart3, QrCode, Shield, Zap, Link2, Globe } from "lucide-react";

const FEATURES = [
  { icon: Zap, title: "Rápido", desc: "Encurte URLs em milissegundos com redirecionamento instantâneo." },
  { icon: BarChart3, title: "Estatísticas", desc: "Acompanhe cliques, dispositivos, navegadores e países em tempo real." },
  { icon: QrCode, title: "QR Codes", desc: "Gere e baixe QR Codes para qualquer link automaticamente." },
  { icon: Link2, title: "Slug personalizado", desc: "Crie links memoráveis com finais personalizados." },
  { icon: Shield, title: "Seguro", desc: "Validação completa, rate limit e proteção contra abusos." },
  { icon: Globe, title: "Em qualquer lugar", desc: "Interface responsiva e tema claro/escuro." },
];

export function Features() {
  return (
    <section id="recursos" className="container py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Tudo o que você precisa
        </h2>
        <p className="mt-2 text-muted-foreground">
          Recursos pensados para criadores, times e empresas.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
