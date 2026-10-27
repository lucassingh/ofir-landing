"use client";

import { ChevronDown, ChevronsDownUp, ChevronsUpDown, EyeOff, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { get, useController, useFieldArray, useFormContext, useFormState, useWatch } from "react-hook-form";
import {
  emptyListItem,
  type BooleanField,
  type EmailField,
  type Field,
  type LeafField,
  type ListField,
  type NumberField,
  type SelectField,
  type StringListField,
  type TextareaField,
  type TextField,
  type UrlField,
} from "@ofir/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { CharCounter, FieldMessage, FieldShell, ItemToolbar } from "./field-shell";
import { GalleryField, ImageField } from "./image-fields";

/**
 * Dibuja un campo del CMS a partir de su declaración en packages/content: la
 * misma que arma el schema, así el contador muestra exactamente el límite que valida.
 */
export function FieldRenderer({ field, name }: { field: Field; name: string }) {
  if (field.kind === "list") return <ListControl field={field} name={name} />;
  return <LeafControl field={field} name={name} />;
}

function LeafControl({ field, name }: { field: LeafField; name: string }) {
  switch (field.kind) {
    case "image":
      return <ImageField field={field} name={name} />;
    case "gallery":
      return <GalleryField field={field} name={name} />;
    case "stringList":
      return <StringListControl field={field} name={name} />;
    case "boolean":
      return <BooleanControl field={field} name={name} />;
    case "select":
      return <SelectControl field={field} name={name} />;
    case "number":
      return <NumberControl field={field} name={name} />;
    default:
      return <TextControl field={field} name={name} />;
  }
}

/** Mensaje de error de un campo, o del arreglo completo (mínimos y máximos). */
function errorMessage(error: unknown): string | undefined {
  if (!error || typeof error !== "object" || Array.isArray(error)) return undefined;
  const e = error as { message?: string; root?: { message?: string } };
  return e.message ?? e.root?.message;
}

const describedBy = (id: string, field: { help?: string }, error?: string) => (field.help || error ? `${id}-desc` : undefined);

function TextControl({ field, name }: { field: TextField | TextareaField | EmailField | UrlField; name: string }) {
  const id = useId();
  const {
    field: { ref, value: raw, onChange, onBlur },
    fieldState,
  } = useController({ name });
  const error = fieldState.error?.message;
  const value = String(raw ?? "");
  const max = "maxLength" in field ? field.maxLength : undefined;
  const common = {
    id,
    value,
    onBlur,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy(id, field, error),
  };

  return (
    <FieldShell
      id={id}
      label={field.label}
      help={field.help}
      error={error}
      aside={max !== undefined && <CharCounter length={value.length} max={max} />}
    >
      {field.kind === "textarea" ? (
        <Textarea {...common} ref={ref} rows={field.rows ?? 3} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Input
          {...common}
          ref={ref}
          onChange={(e) => onChange(e.target.value)}
          type={field.kind === "email" ? "email" : field.kind === "url" ? "url" : "text"}
          inputMode={field.kind === "text" && field.pattern ? "numeric" : undefined}
          placeholder={field.kind === "text" || field.kind === "url" ? field.placeholder : undefined}
          autoComplete="off"
        />
      )}
    </FieldShell>
  );
}

function NumberControl({ field, name }: { field: NumberField; name: string }) {
  const id = useId();
  const {
    field: { ref, value: raw, onChange, onBlur },
    fieldState,
  } = useController({ name });
  const error = fieldState.error?.message;
  return (
    <FieldShell id={id} label={field.label} help={field.help} error={error}>
      <Input
        id={id}
        ref={ref}
        type="number"
        inputMode="numeric"
        min={field.min}
        max={field.max}
        step={1}
        value={typeof raw === "number" && !Number.isNaN(raw) ? raw : ""}
        onChange={(e) => onChange(e.target.value === "" ? Number.NaN : e.target.valueAsNumber)}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, field, error)}
        className="max-w-40 font-mono"
      />
    </FieldShell>
  );
}

function SelectControl({ field, name }: { field: SelectField; name: string }) {
  const id = useId();
  const {
    field: { ref, value: raw, onChange, onBlur },
    fieldState,
  } = useController({ name });
  const error = fieldState.error?.message;
  return (
    <FieldShell id={id} label={field.label} help={field.help} error={error}>
      <NativeSelect
        id={id}
        ref={ref}
        value={String(raw ?? "")}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, field, error)}
      >
        {field.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </NativeSelect>
    </FieldShell>
  );
}

function BooleanControl({ field, name }: { field: BooleanField; name: string }) {
  const id = useId();
  const {
    field: { ref, value: raw, onChange, onBlur },
  } = useController({ name });
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-surface px-3.5 py-3">
      <div className="space-y-0.5">
        <label htmlFor={id} className="text-[13px] font-medium">
          {field.label}
        </label>
        <FieldMessage id={`${id}-desc`} help={field.help} />
      </div>
      <Switch
        id={id}
        ref={ref}
        checked={Boolean(raw)}
        onCheckedChange={onChange}
        onBlur={onBlur}
        aria-describedby={field.help ? `${id}-desc` : undefined}
      />
    </div>
  );
}

/** Frases cortas, una por renglón: se agregan, se ordenan y se quitan. */
function StringListControl({ field, name }: { field: StringListField; name: string }) {
  const id = useId();
  const { field: input } = useController({ name });
  const { errors } = useFormState({ name });
  const items: string[] = Array.isArray(input.value) ? input.value : [];
  const set = (next: string[]) => input.onChange(next);

  const move = (from: number, to: number) => {
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item ?? "");
    set(next);
  };
  const remove = (index: number) => {
    const removed = items[index] ?? "";
    const before = items;
    set(items.filter((_, i) => i !== index));
    if (removed.trim()) toast(`Quitaste “${removed}”`, { action: { label: "Deshacer", onClick: () => set(before) } });
  };

  return (
    <fieldset className="space-y-2.5" aria-describedby={`${id}-desc`}>
      <legend className="mb-2 text-[13px] font-medium">{field.label}</legend>
      <FieldMessage id={`${id}-desc`} help={field.help} error={errorMessage(get(errors, name))} />
      <ol className="space-y-2">
        {items.map((value, i) => {
          const itemError = errorMessage(get(errors, `${name}.${i}`));
          const label = `${field.itemLabel} ${i + 1}`;
          return (
            <li key={i} className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span aria-hidden className="w-5 shrink-0 text-right font-mono text-xs text-muted-foreground">
                  {i + 1}
                </span>
                <div className="relative min-w-0 flex-1">
                  <Input
                    aria-label={label}
                    value={value}
                    onChange={(e) => set(items.map((v, j) => (j === i ? e.target.value : v)))}
                    onBlur={input.onBlur}
                    aria-invalid={itemError ? true : undefined}
                    className="pr-14"
                  />
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
                    <CharCounter length={value.length} max={field.maxLength} />
                  </span>
                </div>
                <ItemToolbar label={label} index={i} count={items.length} onMove={move} onRemove={remove} canRemove={items.length > field.min} />
              </div>
              {itemError && (
                <div className="pl-7">
                  <FieldMessage error={itemError} />
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {items.length < field.max && (
        <Button type="button" variant="outline" size="sm" onClick={() => set([...items, ""])} className="ml-6.5">
          <Plus aria-hidden />
          Agregar {field.itemLabel.toLowerCase()}
        </Button>
      )}
    </fieldset>
  );
}

/** Ítems con varios campos (tarjetas, obras, preguntas). Cada uno se abre y se cierra. */
function ListControl({ field, name }: { field: ListField; name: string }) {
  const { control, getValues } = useFormContext();
  const { fields, append, insert, move, remove } = useFieldArray({ control, name });
  const { errors } = useFormState({ name });
  const variable = field.min !== field.max;
  const inline = field.fields.length === 1;

  // Abiertos por id (estable aunque se reordenen). El ítem recién agregado todavía
  // no tiene id en este render: se lo recuerda por posición hasta la próxima acción.
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(fields.length === 1 ? [fields[0]!.id] : []));
  const [justAdded, setJustAdded] = useState<number | null>(null);
  const isOpen = (i: number) => openIds.has(fields[i]!.id) || i === justAdded;
  const settled = () => {
    const next = new Set(openIds);
    if (justAdded !== null && fields[justAdded]) next.add(fields[justAdded].id);
    setJustAdded(null);
    return next;
  };

  const toggle = (i: number) => {
    const next = settled();
    const itemId = fields[i]!.id;
    if (next.has(itemId)) next.delete(itemId);
    else next.add(itemId);
    setOpenIds(next);
  };
  const add = () => {
    setOpenIds(settled());
    setJustAdded(fields.length);
    append(emptyListItem(field.fields), { shouldFocus: false });
  };
  const moveItem = (from: number, to: number) => {
    setOpenIds(settled());
    move(from, to);
  };
  const removeItem = (index: number) => {
    setOpenIds(settled());
    const value = getValues(`${name}.${index}`) as Record<string, unknown>;
    remove(index);
    const title = field.titleKey ? String(value?.[field.titleKey] ?? "").trim() : "";
    toast(`Quitaste ${title ? `“${title}”` : `${field.itemLabel.toLowerCase()} ${index + 1}`}`, {
      description: "No se publica hasta que guardes.",
      action: { label: "Deshacer", onClick: () => insert(index, value) },
    });
  };

  const allOpen = fields.length > 0 && fields.every((_, i) => isOpen(i));

  return (
    <div className="space-y-3">
      {!inline && fields.length > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            {fields.length} {field.label.toLowerCase()}
            {variable && ` · máximo ${field.max}`}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setJustAdded(null);
              setOpenIds(allOpen ? new Set() : new Set(fields.map((f) => f.id)));
            }}
          >
            {allOpen ? <ChevronsDownUp aria-hidden /> : <ChevronsUpDown aria-hidden />}
            {allOpen ? "Cerrar todas" : "Abrir todas"}
          </Button>
        </div>
      )}

      <FieldMessage error={errorMessage(get(errors, name))} />

      <ol className={inline ? "space-y-4" : "space-y-2.5"}>
        {fields.map((item, i) => {
          const label = field.itemLabels?.[i] ?? `${field.itemLabel} ${i + 1}`;
          const toolbar = variable ? (
            <ItemToolbar
              label={`${field.itemLabel} ${i + 1}`}
              index={i}
              count={fields.length}
              onMove={moveItem}
              onRemove={removeItem}
              canRemove={fields.length > field.min}
            />
          ) : null;

          if (inline) {
            const leaf = field.fields[0]!;
            return (
              <li key={item.id} className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <LeafControl field={{ ...leaf, label: `${label} · ${leaf.label}` }} name={`${name}.${i}.${leaf.key}`} />
                </div>
                {toolbar && <div className="pt-6">{toolbar}</div>}
              </li>
            );
          }

          return (
            <ListItem
              key={item.id}
              field={field}
              name={`${name}.${i}`}
              index={i}
              label={label}
              open={isOpen(i)}
              onToggle={() => toggle(i)}
              toolbar={toolbar}
            />
          );
        })}
      </ol>

      {variable && fields.length < field.max && (
        <Button type="button" variant="outline" onClick={add} className="w-full border-dashed">
          <Plus aria-hidden />
          Agregar {field.itemLabel.toLowerCase()}
        </Button>
      )}
    </div>
  );
}

function ListItem({
  field,
  name,
  index,
  label,
  open,
  onToggle,
  toolbar,
}: {
  field: ListField;
  name: string;
  index: number;
  label: string;
  open: boolean;
  onToggle: () => void;
  toolbar: React.ReactNode;
}) {
  const bodyId = useId();
  const { errors } = useFormState({ name });
  const hasError = Boolean(get(errors, name));
  const titleKey = field.titleKey ?? field.fields[0]!.key;
  const title = useWatch({ name: `${name}.${titleKey}` }) as unknown;
  const visible = useWatch({ name: `${name}.visible` }) as unknown;
  const hidden = field.fields.some((f) => f.key === "visible") && visible === false;
  // con errores se abre sola: si no, no se verían los campos marcados
  const expanded = open || hasError;
  const heading = typeof title === "string" && title.trim() ? title : label;

  return (
    <li
      className={cn(
        "overflow-hidden rounded-xl border bg-surface transition-colors",
        hasError ? "border-danger/40" : expanded ? "border-border-strong" : "border-border",
      )}
    >
      <div className="flex items-center gap-1 pr-1.5">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={bodyId}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-colors hover:bg-muted/60 focus-visible:-outline-offset-2"
        >
          <span
            aria-hidden
            className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/8 font-mono text-xs font-medium ring-1 ring-inset ring-primary/15"
          >
            {index + 1}
          </span>
          <span className="min-w-0 flex-1">
            <span className={cn("block truncate text-sm font-medium", hidden && "text-muted-foreground")}>{heading}</span>
            {heading !== label && <span className="block truncate text-xs text-muted-foreground">{label}</span>}
          </span>
          {hidden && (
            <Badge variant="neutral" className="hidden sm:inline-flex">
              <EyeOff aria-hidden className="size-3" />
              Oculta
            </Badge>
          )}
          {hasError && (
            <Badge variant="danger" dot>
              Revisar
            </Badge>
          )}
          <ChevronDown
            aria-hidden
            className={cn("size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-snappy", !expanded && "-rotate-90")}
          />
        </button>
        {toolbar}
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            id={bodyId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0 }}
          >
            <div className="space-y-5 border-t border-border bg-canvas/40 px-4 py-5">
              {field.fields.map((leaf) => (
                <LeafControl key={leaf.key} field={leaf} name={`${name}.${leaf.key}`} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
