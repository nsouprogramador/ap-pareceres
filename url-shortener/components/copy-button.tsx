"use client";

/**
 * components/copy-button.tsx
 * Botão que copia um texto para a área de transferência com feedback visual.
 */
import * as React from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyButtonProps extends ButtonProps {
  value: string;
  label?: string;
}

export function CopyButton({ value, label, className, ...props }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Link copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  }

  return (
    <Button
      type="button"
      onClick={copy}
      className={cn(className)}
      {...props}
    >
      {copied ? <Check /> : <Copy />}
      {label}
    </Button>
  );
}
