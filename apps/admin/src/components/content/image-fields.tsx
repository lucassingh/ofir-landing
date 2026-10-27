"use client";

import { ArrowLeft, ArrowRight, ImagePlus, LoaderCircle, Star, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useId, useRef, useState } from "react";
import { useController } from "react-hook-form";
import type { GalleryField as GallerySpec, ImageField as ImageSpec } from "@ofir/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mediaUrl } from "@/lib/media";
import { toast } from "@/lib/toast";
import { uploadImage, UploadError } from "@/lib/upload";
import { IMAGE_TYPES } from "@/lib/upload-rules";
import { cn } from "@/lib/utils";
import { FieldMessage, IconAction } from "./field-shell";

const ACCEPT = IMAGE_TYPES.join(",");

function uploadErrorMessage(error: unknown) {
  return error instanceof UploadError ? error.message : "Probá de nuevo en un momento.";
}

/** Zona que acepta fotos arrastradas desde la compu. */
function useDropZone(onFiles: (files: File[]) => void, disabled: boolean) {
  const [over, setOver] = useState(false);
  return {
    over,
    props: {
      onDragOver: (e: React.DragEvent) => {
        if (disabled || !e.dataTransfer.types.includes("Files")) return;
        e.preventDefault();
        setOver(true);
      },
      onDragLeave: () => setOver(false),
      onDrop: (e: React.DragEvent) => {
        if (disabled) return;
        e.preventDefault();
        setOver(false);
        onFiles(Array.from(e.dataTransfer.files));
      },
    },
  };
}

function ProgressOverlay({ label, progress }: { label: string; progress: number }) {
  return (
    <div role="status" className="absolute inset-0 grid place-items-center bg-surface/85 backdrop-blur-[2px]">
      <div className="flex w-3/4 flex-col items-center gap-2 text-center">
        <LoaderCircle aria-hidden className="size-5 animate-spin text-primary" />
        <span className="text-xs font-medium">{label}</span>
        <span aria-hidden className="h-1 w-full overflow-hidden rounded-full bg-border">
          <span className="block h-full rounded-full bg-primary transition-[width] duration-200" style={{ width: `${Math.max(6, progress)}%` }} />
        </span>
      </div>
    </div>
  );
}

/** Una foto: se sube, se cambia o (si es opcional) se quita. */
export function ImageField({ field, name }: { field: ImageSpec; name: string }) {
  const id = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const { field: input, fieldState } = useController({ name });
  const value = String(input.value ?? "");
  const [progress, setProgress] = useState<number | null>(null);
  const uploading = progress !== null;

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setProgress(0);
    try {
      input.onChange(await uploadImage(file, setProgress));
      toast.success("Foto lista", { description: "Se publica cuando guardes." });
    } catch (error) {
      toast.error("No se pudo subir la foto", { description: uploadErrorMessage(error) });
    } finally {
      setProgress(null);
    }
  };
  const drop = useDropZone((files) => void upload(files[0]), uploading);

  return (
    <div className="space-y-2" role="group" aria-labelledby={`${id}-label`}>
      <p id={`${id}-label`} className="text-[13px] font-medium">
        {field.label}
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div
          {...drop.props}
          className={cn(
            "relative w-full overflow-hidden rounded-lg border bg-canvas sm:w-60",
            drop.over ? "border-primary ring-[3px] ring-primary/20" : value ? "border-border" : "border-dashed border-border-strong",
            fieldState.error && "border-danger",
          )}
          style={{ aspectRatio: field.aspect ?? "4 / 3" }}
        >
          {value ? (
            <Image src={mediaUrl(value)} alt="" fill unoptimized sizes="240px" className="object-cover" />
          ) : (
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-4 text-center text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:-outline-offset-2"
            >
              <ImagePlus aria-hidden className="size-5" />
              Tocá para elegir una foto o arrastrala acá
            </button>
          )}
          {uploading && <ProgressOverlay label="Subiendo foto…" progress={progress} />}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => fileInput.current?.click()} disabled={uploading}>
            <Upload aria-hidden />
            {value ? "Cambiar foto" : "Subir foto"}
          </Button>
          {field.optional && value && (
            <Button type="button" variant="ghost" size="sm" onClick={() => input.onChange("")} disabled={uploading}>
              <Trash2 aria-hidden />
              Quitar
            </Button>
          )}
        </div>
        <input
          ref={fileInput}
          type="file"
          accept={ACCEPT}
          tabIndex={-1}
          aria-hidden
          className="sr-only"
          onChange={(e) => {
            void upload(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
      <FieldMessage help={field.help} error={fieldState.error?.message} />
    </div>
  );
}

/** Varias fotos en orden; la primera es la portada. */
export function GalleryField({ field, name }: { field: GallerySpec; name: string }) {
  const id = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const { field: input, fieldState } = useController({ name });
  const photos: string[] = Array.isArray(input.value) ? input.value : [];
  const [queue, setQueue] = useState<{ index: number; total: number; progress: number } | null>(null);
  const uploading = queue !== null;
  const room = field.max - photos.length;

  const set = (next: string[]) => input.onChange(next);
  const move = (from: number, to: number) => {
    const next = [...photos];
    const [photo] = next.splice(from, 1);
    next.splice(to, 0, photo!);
    set(next);
  };
  const remove = (index: number) => {
    const before = photos;
    set(photos.filter((_, i) => i !== index));
    toast("Quitaste una foto", {
      description: "No se publica hasta que guardes.",
      action: { label: "Deshacer", onClick: () => set(before) },
    });
  };

  const addFiles = async (files: File[]) => {
    const batch = files.slice(0, room);
    if (batch.length === 0) return;
    if (files.length > batch.length) {
      toast.warning(`Entran ${field.max} fotos como máximo`, { description: `Se suben las primeras ${batch.length}.` });
    }
    let current = photos;
    let failed = 0;
    for (const [index, file] of batch.entries()) {
      setQueue({ index, total: batch.length, progress: 0 });
      try {
        const url = await uploadImage(file, (progress) => setQueue({ index, total: batch.length, progress }));
        current = [...current, url];
        set(current);
      } catch (error) {
        failed++;
        toast.error(`No se pudo subir “${file.name}”`, { description: uploadErrorMessage(error) });
      }
    }
    setQueue(null);
    const uploaded = batch.length - failed;
    if (uploaded > 0) {
      toast.success(uploaded === 1 ? "Foto agregada" : `${uploaded} fotos agregadas`, { description: "Se publican cuando guardes." });
    }
  };
  const drop = useDropZone((files) => void addFiles(files), uploading || room <= 0);

  return (
    <div className="space-y-2" role="group" aria-labelledby={`${id}-label`}>
      <div className="flex items-baseline justify-between gap-3">
        <p id={`${id}-label`} className="text-[13px] font-medium">
          {field.label}
        </p>
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
          {photos.length}/{field.max}
        </span>
      </div>

      <ul
        {...drop.props}
        className={cn(
          "grid grid-cols-2 gap-2.5 rounded-xl p-0.5 sm:grid-cols-3",
          drop.over && "ring-[3px] ring-primary/25",
        )}
      >
        {photos.map((src, i) => (
          <li key={`${src}-${i}`} className="overflow-hidden rounded-lg border border-border bg-surface">
            <div className="relative aspect-4/5 bg-canvas">
              <Image src={mediaUrl(src)} alt={`Foto ${i + 1}`} fill unoptimized sizes="200px" className="object-cover" />
              {i === 0 && (
                <Badge variant="outline" className="absolute left-2 top-2 border-transparent bg-surface/90 shadow-card">
                  <Star aria-hidden className="size-3 fill-accent text-accent" />
                  Portada
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between px-1 py-0.5">
              <div className="flex">
                <IconAction label={`Mover la foto ${i + 1} a la izquierda`} disabled={i === 0 || uploading} onClick={() => move(i, i - 1)}>
                  <ArrowLeft />
                </IconAction>
                <IconAction
                  label={`Mover la foto ${i + 1} a la derecha`}
                  disabled={i === photos.length - 1 || uploading}
                  onClick={() => move(i, i + 1)}
                >
                  <ArrowRight />
                </IconAction>
              </div>
              <div className="flex">
                {i > 0 && (
                  <IconAction label={`Usar la foto ${i + 1} de portada`} disabled={uploading} onClick={() => move(i, 0)}>
                    <Star />
                  </IconAction>
                )}
                <IconAction label={`Quitar la foto ${i + 1}`} disabled={uploading} onClick={() => remove(i)} danger>
                  <Trash2 />
                </IconAction>
              </div>
            </div>
          </li>
        ))}

        {(room > 0 || uploading) && (
          <li className="relative overflow-hidden rounded-lg">
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={uploading}
              className="flex aspect-4/5 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border-strong bg-canvas px-3 text-center text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted hover:text-foreground disabled:pointer-events-none focus-visible:-outline-offset-2"
            >
              <ImagePlus aria-hidden className="size-5" />
              <span className="font-medium text-foreground">Agregar fotos</span>
              <span>Podés elegir varias o arrastrarlas</span>
            </button>
            {queue && (
              <ProgressOverlay
                label={queue.total > 1 ? `Subiendo ${queue.index + 1} de ${queue.total}…` : "Subiendo foto…"}
                progress={queue.progress}
              />
            )}
          </li>
        )}
      </ul>

      <input
        ref={fileInput}
        type="file"
        accept={ACCEPT}
        multiple
        tabIndex={-1}
        aria-hidden
        className="sr-only"
        onChange={(e) => {
          void addFiles(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />
      <FieldMessage help={field.help} error={fieldState.error?.message ?? fieldState.error?.root?.message} />
    </div>
  );
}
