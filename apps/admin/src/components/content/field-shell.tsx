"use client";

import { ArrowDown, ArrowUp, CircleAlert, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/** Etiqueta + control + ayuda o error. El id del texto de ayuda es `${id}-desc` (para aria-describedby). */
export function FieldShell({
  id,
  label,
  help,
  error,
  aside,
  children,
}: {
  id: string;
  label: string;
  help?: string;
  error?: string;
  /** A la derecha de la etiqueta (contador de caracteres). */
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={id}>{label}</Label>
        {aside}
      </div>
      {children}
      <FieldMessage id={`${id}-desc`} help={help} error={error} />
    </div>
  );
}

export function FieldMessage({ id, help, error }: { id?: string; help?: string; error?: string }) {
  if (!error && !help) return null;
  return (
    <p
      id={id}
      className={cn("flex gap-1.5 text-xs leading-relaxed", error ? "font-medium text-danger" : "text-muted-foreground")}
    >
      {error && <CircleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0" />}
      {error ?? help}
    </p>
  );
}

/** "42/60": se pone en rojo si se pasa. */
export function CharCounter({ length, max }: { length: number; max: number }) {
  const over = length > max;
  return (
    <span
      aria-hidden
      className={cn("shrink-0 font-mono text-[11px] tabular-nums", over ? "font-medium text-danger" : "text-muted-foreground")}
    >
      {length}/{max}
    </span>
  );
}

/** Subir / bajar / quitar un ítem de una lista. */
export function ItemToolbar({
  label,
  index,
  count,
  onMove,
  onRemove,
  canRemove,
  className,
}: {
  /** "Pregunta 3": se usa en las etiquetas para lectores de pantalla. */
  label: string;
  index: number;
  count: number;
  onMove?: (from: number, to: number) => void;
  onRemove?: (index: number) => void;
  canRemove: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex shrink-0 items-center", className)}>
      {onMove && (
        <>
          <IconAction label={`Subir ${label}`} disabled={index === 0} onClick={() => onMove(index, index - 1)}>
            <ArrowUp />
          </IconAction>
          <IconAction label={`Bajar ${label}`} disabled={index === count - 1} onClick={() => onMove(index, index + 1)}>
            <ArrowDown />
          </IconAction>
        </>
      )}
      {onRemove && (
        <IconAction label={`Quitar ${label}`} disabled={!canRemove} onClick={() => onRemove(index)} danger>
          <Trash2 />
        </IconAction>
      )}
    </div>
  );
}

export function IconAction({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={label}
          disabled={disabled}
          onClick={onClick}
          className={cn(danger && "hover:bg-danger/10 hover:text-danger")}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}
