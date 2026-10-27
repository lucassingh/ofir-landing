import { upload } from "@vercel/blob/client";
import { IMAGE_TYPES, MAX_IMAGE_BYTES, MAX_IMAGE_SIDE, UPLOAD_PREFIX } from "@/lib/upload-rules";

/** Error con un mensaje listo para mostrarle a la persona. */
export class UploadError extends Error {}

const isImageType = (type: string): type is (typeof IMAGE_TYPES)[number] => (IMAGE_TYPES as readonly string[]).includes(type);

/** Nombre legible para el archivo: "Foto Galpón 2.JPG" → "foto-galpon-2". */
function baseName(name: string) {
  const slug = name
    .replace(/\.[^.]+$/, "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return slug || "foto";
}

/**
 * Achica la foto en el navegador antes de subirla (las del celular pesan 5–10 MB):
 * lado mayor de 2400 px en WebP. Si no conviene (ya es chica) devuelve el original.
 */
async function shrink(file: File): Promise<Blob> {
  if (file.type === "image/avif") return file;
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size < 1_500_000) {
    bitmap.close();
    return file;
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.86));
  return blob && blob.size < file.size ? blob : file;
}

async function failureReason(): Promise<string> {
  try {
    const res = await fetch("/api/upload", { cache: "no-store" });
    const json = (await res.json()) as { error?: string };
    if (json.error) return json.error;
  } catch {}
  return "No se pudo subir la foto. Revisá la conexión y probá de nuevo.";
}

/** Sube una foto a Vercel Blob y devuelve su URL pública. */
export async function uploadImage(file: File, onProgress?: (percentage: number) => void): Promise<string> {
  if (!isImageType(file.type)) throw new UploadError("Ese formato no sirve: subí una foto JPG, PNG o WebP.");

  const body = await shrink(file).catch(() => file);
  if (body.size > MAX_IMAGE_BYTES) throw new UploadError("La foto pesa demasiado (máximo 15 MB).");

  const type = body.type || file.type;
  const extension = type.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
  try {
    const blob = await upload(`${UPLOAD_PREFIX}${baseName(file.name)}.${extension}`, body, {
      access: "public",
      handleUploadUrl: "/api/upload",
      contentType: type,
      onUploadProgress: ({ percentage }) => onProgress?.(percentage),
    });
    return blob.url;
  } catch {
    throw new UploadError(await failureReason());
  }
}
