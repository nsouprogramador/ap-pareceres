/**
 * components/footer.tsx
 * Rodapé com links institucionais e créditos.
 */
import Link from "next/link";
import { Link2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t mt-24">
      <div className="container grid gap-8 py-12 md:grid-cols-4">
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Link2 className="h-4 w-4" />
            </span>
            Linkly
          </Link>
          <p className="text-sm text-muted-foreground">
            Encurtador de links rápido, seguro e com estatísticas em tempo real.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Produto</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/#recursos" className="hover:text-foreground">Recursos</Link></li>
            <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
            <li><Link href="/#faq" className="hover:text-foreground">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Conta</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/login" className="hover:text-foreground">Entrar</Link></li>
            <li><Link href="/register" className="hover:text-foreground">Criar conta</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><span>Termos de uso</span></li>
            <li><span>Privacidade</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-6">
        <p className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Linkly. Feito com Next.js, Prisma e Tailwind.
        </p>
      </div>
    </footer>
  );
}
