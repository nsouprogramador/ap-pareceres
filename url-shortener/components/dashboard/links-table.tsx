"use client";

/**
 * components/dashboard/links-table.tsx
 * Tabela responsiva de links com ações: copiar, QR, editar, ativar/desativar,
 * excluir (com confirmação) e atalho para estatísticas detalhadas.
 */
import * as React from "react";
import { ExternalLink, MoreVertical, Pencil, Trash2, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CopyButton } from "@/components/copy-button";
import { QrCodeDialog } from "@/components/qr-code";
import { EditLinkDialog } from "@/components/dashboard/edit-link-dialog";
import { LinkStatsDialog } from "@/components/dashboard/link-stats-dialog";
import { formatDate, formatNumber, prettyUrl } from "@/utils/format";
import type { LinkDTO } from "@/types";
import type { UpdateLinkInput } from "@/lib/validations";

interface Props {
  links: LinkDTO[];
  onUpdate: (id: string, input: UpdateLinkInput) => Promise<unknown>;
  onDelete: (id: string) => Promise<void>;
  onToggle: (link: LinkDTO) => Promise<void>;
}

function StatusBadge({ link }: { link: LinkDTO }) {
  if (link.isExpired) return <Badge variant="destructive">Expirado</Badge>;
  if (!link.active) return <Badge variant="secondary">Inativo</Badge>;
  return <Badge variant="success">Ativo</Badge>;
}

export function LinksTable({ links, onUpdate, onDelete, onToggle }: Props) {
  const [editing, setEditing] = React.useState<LinkDTO | null>(null);
  const [statsFor, setStatsFor] = React.useState<LinkDTO | null>(null);
  const [deleting, setDeleting] = React.useState<LinkDTO | null>(null);
  const [busy, setBusy] = React.useState(false);

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await onDelete(deleting.id);
      toast.success("Link excluído.");
      setDeleting(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Link</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden lg:table-cell">Criado</TableHead>
              <TableHead className="text-right">Cliques</TableHead>
              <TableHead className="w-[1%]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link) => (
              <TableRow key={link.id}>
                <TableCell>
                  <a
                    href={link.shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 font-medium text-primary hover:underline"
                  >
                    /{link.slug}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <p className="max-w-[260px] truncate text-xs text-muted-foreground">
                    {prettyUrl(link.originalUrl, 44)}
                  </p>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <StatusBadge link={link} />
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                  {formatDate(link.createdAt)}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  {formatNumber(link.clicks)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <CopyButton value={link.shortUrl} variant="ghost" size="icon" />
                    <div className="hidden sm:block">
                      <QrCodeDialog url={link.shortUrl} />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Mais ações">
                          <MoreVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setStatsFor(link)}>
                          <BarChart3 /> Estatísticas
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditing(link)}>
                          <Pencil /> Editar
                        </DropdownMenuItem>
                        <div className="flex items-center justify-between px-2 py-1.5 text-sm">
                          <span>Ativo</span>
                          <Switch
                            checked={link.active}
                            onCheckedChange={async () => {
                              try {
                                await onToggle(link);
                                toast.success(link.active ? "Link desativado." : "Link ativado.");
                              } catch {
                                toast.error("Erro ao alterar status.");
                              }
                            }}
                          />
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleting(link)}
                        >
                          <Trash2 /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editing && (
        <EditLinkDialog
          link={editing}
          open={!!editing}
          onOpenChange={(o) => !o && setEditing(null)}
          onSave={onUpdate}
        />
      )}

      {statsFor && (
        <LinkStatsDialog
          link={statsFor}
          open={!!statsFor}
          onOpenChange={(o) => !o && setStatsFor(null)}
        />
      )}

      <Dialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir link?</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. O link <strong>/{deleting?.slug}</strong> e
              suas estatísticas serão removidos permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)} disabled={busy}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={busy}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
