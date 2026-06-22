/**
 * app/dashboard/links/page.tsx
 * Página de gerenciamento de links (Server Component que renderiza o manager
 * client com busca, filtros, ordenação, edição e exclusão).
 */
import type { Metadata } from "next";
import { LinksManager } from "@/components/dashboard/links-manager";

export const metadata: Metadata = { title: "Meus links" };

export default function LinksPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Meus links</h1>
        <p className="text-muted-foreground">
          Crie, edite, ative/desative e acompanhe seus links.
        </p>
      </div>
      <LinksManager />
    </div>
  );
}
