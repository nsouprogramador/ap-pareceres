"use client";

/**
 * components/faq.tsx
 * Perguntas frequentes em formato acordeão acessível (detalhes nativos).
 */
import { ChevronDown } from "lucide-react";

const ITEMS = [
  {
    q: "O encurtador é gratuito?",
    a: "Sim. Você pode criar links sem cadastro. Ao criar uma conta, seus links se tornam permanentes e você ganha acesso a estatísticas detalhadas.",
  },
  {
    q: "Os links anônimos expiram?",
    a: "Links criados sem login expiram automaticamente em 7 dias. Crie uma conta gratuita para links permanentes.",
  },
  {
    q: "Posso escolher o slug do meu link?",
    a: "Sim! Use a opção 'Personalizar slug' para definir um final personalizado, desde que ainda esteja disponível.",
  },
  {
    q: "Quais estatísticas são registradas?",
    a: "Registramos cliques, navegador, sistema operacional, dispositivo, país e referência — sem armazenar dados pessoais desnecessários.",
  },
  {
    q: "Posso gerar QR Codes?",
    a: "Sim, todo link possui um QR Code que pode ser visualizado e baixado em PNG com um clique.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="container py-16">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          Perguntas frequentes
        </h2>
        <p className="mt-2 text-center text-muted-foreground">
          Tudo o que você precisa saber sobre o Linkly.
        </p>

        <div className="mt-8 space-y-3">
          {ITEMS.map((item) => (
            <details
              key={item.q}
              className="group rounded-lg border bg-card p-4 [&_svg]:open:rotate-180"
            >
              <summary className="flex cursor-pointer items-center justify-between font-medium">
                {item.q}
                <ChevronDown className="h-5 w-5 transition-transform" />
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
