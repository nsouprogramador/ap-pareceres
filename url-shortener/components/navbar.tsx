"use client";

/**
 * components/navbar.tsx
 * Cabeçalho responsivo com logo, navegação, alternância de tema e ações de
 * sessão (entrar/dashboard/sair). Menu colapsável em telas pequenas.
 */
import * as React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Link2, Menu, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b glass">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Link2 className="h-5 w-5" />
          </span>
          Linkly
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/#recursos">Recursos</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/#faq">FAQ</Link>
          </Button>
          <ThemeToggle />
          {status === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default">
                  {session.user?.name?.split(" ")[0] ?? "Conta"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{session.user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  <LogOut /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Criar conta</Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {open && (
        <div className="container flex flex-col gap-2 border-t py-4 md:hidden animate-fade-in">
          <Link href="/#recursos" className="py-2" onClick={() => setOpen(false)}>
            Recursos
          </Link>
          <Link href="/#faq" className="py-2" onClick={() => setOpen(false)}>
            FAQ
          </Link>
          {status === "authenticated" ? (
            <>
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Criar conta</Link>
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
