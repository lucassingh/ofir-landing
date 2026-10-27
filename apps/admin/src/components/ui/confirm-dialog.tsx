"use client";

import { LoaderCircle } from "lucide-react";
import { AlertDialog } from "radix-ui";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  pending?: boolean;
  /** "danger" para acciones que pisan o borran algo. */
  tone?: "primary" | "danger";
};

/** Confirmación para acciones que no se pueden deshacer (Radix AlertDialog: foco atrapado, Esc cierra). */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  pending = false,
  tone = "primary",
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] data-[state=open]:animate-fade-in" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-popover p-6 shadow-popover outline-none data-[state=open]:animate-pop-in">
          <AlertDialog.Title className="font-display text-lg font-bold tracking-tight [font-stretch:112%]">{title}</AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
            {description}
          </AlertDialog.Description>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <AlertDialog.Cancel asChild>
              <Button variant="outline" disabled={pending}>
                Cancelar
              </Button>
            </AlertDialog.Cancel>
            <Button
              onClick={onConfirm}
              disabled={pending}
              className={tone === "danger" ? "bg-danger text-white hover:bg-danger/90 dark:text-canvas" : undefined}
            >
              {pending && <LoaderCircle aria-hidden className="animate-spin" />}
              {confirmLabel}
            </Button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
