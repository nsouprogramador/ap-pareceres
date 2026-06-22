/**
 * app/register/page.tsx
 * Página de cadastro.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { Link2 } from "lucide-react";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Criar conta" };

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <Link href="/" className="mb-8 flex items-center gap-2 text-xl font-bold">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Link2 className="h-5 w-5" />
        </span>
        Linkly
      </Link>
      <RegisterForm />
    </div>
  );
}
