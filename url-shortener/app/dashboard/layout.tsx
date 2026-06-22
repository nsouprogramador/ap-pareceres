/**
 * app/dashboard/layout.tsx
 * Layout autenticado do painel. Garante a sessão no servidor e monta a
 * navegação lateral/superior compartilhada entre as páginas do dashboard.
 */
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardNav user={{ name: session.user.name, email: session.user.email }} />
      <main className="container py-8">{children}</main>
    </div>
  );
}
