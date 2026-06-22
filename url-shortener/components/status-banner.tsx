"use client";

/**
 * components/status-banner.tsx
 * Exibe um toast quando o usuário é redirecionado de volta para a home após
 * acessar um slug inexistente, inativo ou expirado.
 */
import * as React from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const MESSAGES: Record<string, string> = {
  "nao-encontrado": "Link não encontrado.",
  inativo: "Este link está desativado.",
  expirado: "Este link expirou.",
};

export function StatusBanner() {
  const params = useSearchParams();
  const status = params.get("status");

  React.useEffect(() => {
    if (status && MESSAGES[status]) {
      toast.error(MESSAGES[status]);
    }
  }, [status]);

  return null;
}
