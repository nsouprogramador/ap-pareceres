/**
 * app/login/page.tsx
 * Página de login (Server Component) que renderiza o formulário client.
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Link2 } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <Link href="/" className="mb-8 flex items-center gap-2 text-xl font-bold">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Link2 className="h-5 w-5" />
        </span>
        Linkly
      </Link>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
