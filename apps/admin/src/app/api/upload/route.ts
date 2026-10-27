import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isStoreConfigured } from "@ofir/content/store";
import { getCurrentUser } from "@/lib/auth";
import { IMAGE_TYPES, MAX_IMAGE_BYTES, UPLOAD_PREFIX } from "@/lib/upload-rules";

/**
 * Subida de fotos directo del navegador a Vercel Blob (así no hay límite de
 * tamaño del servidor). Esta ruta solo firma el permiso: verifica la sesión,
 * la carpeta, el tipo y el peso del archivo.
 */
const STORE_MISSING = "El almacenamiento no está conectado (falta BLOB_READ_WRITE_TOKEN).";

/**
 * Si la subida falla, el cliente de Blob solo dice "Failed to retrieve the client
 * token". El panel pregunta acá el motivo para mostrar un mensaje útil.
 */
export async function GET() {
  if (!(await getCurrentUser())) return Response.json({ error: "Tu sesión venció. Volvé a ingresar." }, { status: 401 });
  if (!isStoreConfigured()) return Response.json({ error: STORE_MISSING }, { status: 503 });
  return Response.json({ ok: true });
}

export async function POST(request: Request) {
  if (!isStoreConfigured()) return Response.json({ error: STORE_MISSING }, { status: 503 });

  try {
    const body = (await request.json()) as HandleUploadBody;
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await getCurrentUser())) throw new Error("Tu sesión venció. Volvé a ingresar.");
        if (!pathname.startsWith(UPLOAD_PREFIX)) throw new Error("Carpeta no permitida.");
        return {
          allowedContentTypes: [...IMAGE_TYPES],
          maximumSizeInBytes: MAX_IMAGE_BYTES,
          addRandomSuffix: true,
          cacheControlMaxAge: 60 * 60 * 24 * 365,
        };
      },
    });
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "No se pudo subir la foto." }, { status: 400 });
  }
}
