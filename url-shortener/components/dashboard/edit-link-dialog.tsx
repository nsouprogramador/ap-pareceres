"use client";

/**
 * components/dashboard/edit-link-dialog.tsx
 * Modal de edição de um link (URL de destino, slug, expiração e status).
 */
import * as React from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { LinkDTO } from "@/types";
import type { UpdateLinkInput } from "@/lib/validations";

interface Props {
  link: LinkDTO;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, input: UpdateLinkInput) => Promise<unknown>;
}

function toDateInput(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

export function EditLinkDialog({ link, open, onOpenChange, onSave }: Props) {
  const [originalUrl, setOriginalUrl] = React.useState(link.originalUrl);
  const [slug, setSlug] = React.useState(link.slug);
  const [active, setActive] = React.useState(link.active);
  const [expiration, setExpiration] = React.useState(toDateInput(link.expirationDate));
  const [saving, setSaving] = React.useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const input: UpdateLinkInput = {
        originalUrl,
        slug: slug !== link.slug ? slug : undefined,
        active,
        expirationDate: expiration ? new Date(expiration).toISOString() : null,
      };
      await onSave(link.id, input);
      toast.success("Link atualizado!");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar link</DialogTitle>
          <DialogDescription>Atualize as informações do seu link.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-url">URL de destino</Label>
            <Input
              id="edit-url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-slug">Slug</Label>
            <Input id="edit-slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-exp">Data de expiração (opcional)</Label>
            <Input
              id="edit-exp"
              type="date"
              value={expiration}
              onChange={(e) => setExpiration(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label htmlFor="edit-active">Link ativo</Label>
            <Switch id="edit-active" checked={active} onCheckedChange={setActive} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="animate-spin" />}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
