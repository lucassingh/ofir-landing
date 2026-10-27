"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, History, LoaderCircle, RotateCcw, Save, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore, useTransition } from "react";
import { FormProvider, useForm, useWatch, type FieldErrors } from "react-hook-form";
import { buildSectionSchema, SECTIONS, type SectionKey, type SeoContent, type SiteContent } from "@ofir/content";
import { resetSectionAction, saveSectionAction, type SaveResult, type SectionMeta } from "@/app/(dashboard)/contenido/[section]/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Kbd } from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";
import type { StoreStatus } from "@/lib/cms";
import { formatDateTime } from "@/lib/format";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { FieldRenderer } from "./fields";
import { LivePreview } from "./live-preview";
import { SeoPreview } from "./seo-preview";

type Values = Record<string, unknown>;

type SectionEditorProps = {
  sectionKey: SectionKey;
  initialValues: Values;
  /** Toda la web publicada: la vista previa reemplaza solo esta sección. */
  siteContent: SiteContent;
  meta: SectionMeta;
  customized: boolean;
  storeStatus: StoreStatus;
};

/** Cuenta los campos con error (incluye los de adentro de listas). */
function countErrors(errors: unknown): number {
  if (!errors || typeof errors !== "object") return 0;
  if ("message" in errors && typeof (errors as { message?: unknown }).message === "string") return 1;
  return Object.values(errors).reduce<number>((total, value) => total + countErrors(value), 0);
}

export function SectionEditor({ sectionKey, initialValues, siteContent, meta: initialMeta, customized: initialCustomized, storeStatus }: SectionEditorProps) {
  const router = useRouter();
  const def = SECTIONS[sectionKey];
  const schema = useMemo(() => buildSectionSchema(def.groups), [def]);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: initialValues, mode: "onTouched" });
  const { control, handleSubmit, reset, formState } = form;
  const { isDirty, isSubmitting } = formState;

  const [meta, setMeta] = useState(initialMeta);
  const [customized, setCustomized] = useState(initialCustomized);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, startReset] = useTransition();
  const canSave = storeStatus === "ready";
  const busy = isSubmitting || resetting;

  const values = useWatch({ control }) as Values;
  const previewContent = useMemo(() => ({ ...siteContent, [sectionKey]: values }), [siteContent, sectionKey, values]);

  const announce = useCallback(
    (result: Extract<SaveResult, { ok: true }>, message: string) => {
      if (result.published) {
        toast.success(message, {
          description: "La web ya muestra los cambios.",
          action: { label: "Ver en la web", onClick: () => window.open(`${siteConfig.siteUrl}${def.href}`, "_blank", "noopener") },
        });
      } else {
        toast.warning(`${message}, pero la web no confirmó`, {
          description: "Puede tardar hasta un día en verse. Si pasa siempre, avisale a quien administra el panel.",
        });
      }
    },
    [def.href],
  );

  const onSave = handleSubmit(
    async (data) => {
      const result = await saveSectionAction(sectionKey, data);
      if (!result.ok) {
        toast.error("No se guardaron los cambios", { description: result.error });
        return;
      }
      reset(result.values);
      setMeta(result.meta);
      setCustomized(true);
      announce(result, "Guardado y publicado");
      router.refresh();
    },
    (errors: FieldErrors) => {
      const count = countErrors(errors);
      toast.error("Revisá los campos marcados en rojo", {
        description: count === 1 ? "Hay un campo para corregir antes de guardar." : `Hay ${count} campos para corregir antes de guardar.`,
      });
    },
  );

  const save = useCallback(() => {
    if (!canSave || busy) return;
    void onSave();
  }, [canSave, busy, onSave]);

  const restoreOriginal = () =>
    startReset(async () => {
      const result = await resetSectionAction(sectionKey);
      if (!result.ok) {
        toast.error("No se pudo restaurar", { description: result.error });
        return;
      }
      reset(result.values);
      setMeta(result.meta);
      setCustomized(false);
      setConfirmReset(false);
      announce(result, "Volvió a los textos originales");
      router.refresh();
    });

  // ⌘S / Ctrl+S guarda.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // el autocompletar de Chrome dispara keydown sin `key`
      if (event.key?.toLowerCase() !== "s" || !(event.metaKey || event.ctrlKey) || event.altKey) return;
      event.preventDefault();
      if (isDirty) save();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDirty, save]);

  // Con cambios sin guardar: aviso al cerrar la pestaña y al navegar a otra pantalla del panel.
  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank") return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      if (!window.confirm("Tenés cambios sin guardar en esta sección. ¿Salir igual y perderlos?")) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [isDirty]);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        noValidate
        aria-label={`Editar ${def.label}`}
      >
        {storeStatus !== "ready" && <StoreNotice status={storeStatus} />}

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div className="space-y-6">
            {def.groups.map((group) => (
              <Card key={group.title}>
                <CardHeader>
                  <div className="space-y-1">
                    <CardTitle>{group.title}</CardTitle>
                    {group.help && <CardDescription className="text-pretty">{group.help}</CardDescription>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-5">
                  {group.fields.map((field) => (
                    <FieldRenderer key={field.key} field={field} name={field.key} />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* top-20 = navbar (3.5rem) + 1.5rem de aire */}
          <div className="xl:sticky xl:top-20">
            {def.previewTarget ? (
              <LivePreview content={previewContent} target={def.previewTarget} />
            ) : (
              <SeoPreview values={values as Partial<SeoContent>} />
            )}
          </div>
        </div>

        {/* Barra fija de acciones: queda pegada abajo mientras se edita. */}
        <div className="sticky bottom-0 z-20 -mx-4 mt-6 border-t border-border bg-surface/92 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <SaveStatus dirty={isDirty} meta={meta} customized={customized} />

            <div className="ml-auto flex flex-wrap items-center gap-2">
              {isDirty ? (
                <Button type="button" variant="ghost" onClick={() => reset()} disabled={busy}>
                  <Undo2 aria-hidden />
                  Descartar cambios
                </Button>
              ) : (
                customized && (
                  <Button type="button" variant="ghost" onClick={() => setConfirmReset(true)} disabled={busy || !canSave}>
                    <RotateCcw aria-hidden />
                    Restaurar original
                  </Button>
                )
              )}
              <Button type="submit" size="lg" disabled={!isDirty || busy || !canSave} className="min-w-44">
                {isSubmitting ? <LoaderCircle aria-hidden className="animate-spin" /> : <Save aria-hidden />}
                {isSubmitting ? "Publicando…" : "Guardar y publicar"}
                {!isSubmitting && <SaveShortcut />}
              </Button>
            </div>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={confirmReset}
        onOpenChange={setConfirmReset}
        title="¿Volver a los textos originales?"
        description={`Los textos y fotos de “${def.label}” vuelven a los que tenía la web cuando se lanzó. Se publica al instante.`}
        confirmLabel="Restaurar y publicar"
        onConfirm={restoreOriginal}
        pending={resetting}
        tone="danger"
      />
    </FormProvider>
  );
}

const noSubscribe = () => () => {};
const isMac = () => /Mac|iPhone|iPad/.test(navigator.userAgent);

/** "⌘S" en Mac, "Ctrl S" en el resto (en el servidor no se sabe: arranca con "Ctrl S"). */
function SaveShortcut() {
  const mac = useSyncExternalStore(noSubscribe, isMac, () => false);
  return <Kbd className="ml-1 hidden md:inline">{mac ? "⌘S" : "Ctrl S"}</Kbd>;
}

function SaveStatus({ dirty, meta, customized }: { dirty: boolean; meta: SectionMeta; customized: boolean }) {
  return (
    <p role="status" className="flex min-w-0 items-center gap-2 text-[13px]">
      {dirty ? (
        <>
          <span aria-hidden className="size-2 shrink-0 rounded-full bg-warning" />
          <span className="font-medium">Cambios sin guardar</span>
        </>
      ) : (
        <>
          <History aria-hidden className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate text-muted-foreground">
            {customized && meta.updatedAt
              ? `Publicado el ${formatDateTime(meta.updatedAt)}${meta.updatedBy ? ` · ${meta.updatedBy}` : ""}`
              : "Textos originales de la web"}
          </span>
        </>
      )}
    </p>
  );
}

function StoreNotice({ status }: { status: Exclude<StoreStatus, "ready"> }) {
  return (
    <div
      role="alert"
      className={cn(
        "mb-6 flex items-start gap-3 rounded-xl border px-4 py-3.5 text-sm",
        status === "error" ? "border-danger/30 bg-danger/6" : "border-warning/30 bg-warning/8",
      )}
    >
      <CircleAlert aria-hidden className={cn("mt-0.5 size-4 shrink-0", status === "error" ? "text-danger" : "text-warning")} />
      <div className="space-y-1">
        <p className="font-medium">
          {status === "error" ? "No pudimos leer lo publicado" : "El almacenamiento no está conectado"}
        </p>
        <p className="text-pretty text-muted-foreground">
          {status === "error"
            ? "Para no pisar los cambios que ya están en la web, guardar está desactivado. Recargá la página en un momento."
            : "Ves los textos originales y podés probar la vista previa, pero para guardar hay que conectar Vercel Blob (BLOB_READ_WRITE_TOKEN)."}
        </p>
      </div>
    </div>
  );
}
