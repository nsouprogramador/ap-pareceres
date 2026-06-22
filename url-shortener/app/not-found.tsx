/**
 * app/not-found.tsx
 * Página 404 amigável.
 */
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-7xl font-bold text-primary">404</p>
      <h1 className="text-2xl font-semibold">Página não encontrada</h1>
      <p className="max-w-md text-muted-foreground">
        O link que você tentou acessar não existe, expirou ou foi desativado.
      </p>
      <Button asChild>
        <Link href="/">Voltar para o início</Link>
      </Button>
    </div>
  );
}
