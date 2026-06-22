"use client";

/**
 * components/qr-code.tsx
 * Exibe o QR Code de um link em um modal e permite baixá-lo como PNG.
 */
import * as React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { QrCode, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function QrCodeDialog({ url }: { url: string }) {
  const ref = React.useRef<HTMLDivElement>(null);

  function download() {
    const canvas = ref.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" aria-label="QR Code">
          <QrCode />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
        </DialogHeader>
        <div ref={ref} className="flex justify-center rounded-lg bg-white p-6">
          <QRCodeCanvas value={url} size={208} level="M" includeMargin />
        </div>
        <p className="truncate text-center text-xs text-muted-foreground">{url}</p>
        <Button onClick={download} className="w-full">
          <Download /> Baixar PNG
        </Button>
      </DialogContent>
    </Dialog>
  );
}
