// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

// Vercel Blob en memoria: guarda por ruta, con ETag y la misma semántica de ifMatch / allowOverwrite.
const blob = vi.hoisted(() => {
  class BlobPreconditionFailedError extends Error {}
  const files = new Map<string, { body: string; etag: string; uploadedAt: Date }>();
  let counter = 0;
  const url = (path: string) => `https://store.test/${path}`;
  return {
    files,
    BlobPreconditionFailedError,
    reset: () => {
      files.clear();
      counter = 0;
    },
    api: {
      BlobPreconditionFailedError,
      get: vi.fn(async (path: string) => {
        const file = files.get(path);
        return file ? { statusCode: 200, stream: new Response(file.body).body, blob: { etag: file.etag } } : null;
      }),
      put: vi.fn(async (path: string, body: string, options: { addRandomSuffix?: boolean; ifMatch?: string; allowOverwrite?: boolean }) => {
        const finalPath = options.addRandomSuffix ? path.replace(/\.json$/, `-${++counter}.json`) : path;
        const existing = files.get(finalPath);
        if (options.ifMatch !== undefined && existing?.etag !== options.ifMatch) throw new BlobPreconditionFailedError();
        if (existing && options.ifMatch === undefined && !options.allowOverwrite) throw new Error("ya existe");
        files.set(finalPath, { body, etag: `etag-${++counter}`, uploadedAt: new Date(Date.now() + counter) });
        return { url: url(finalPath) };
      }),
      list: vi.fn(async ({ prefix }: { prefix: string }) => ({
        blobs: [...files.entries()]
          .filter(([path]) => path.startsWith(prefix))
          .map(([path, file]) => ({ url: url(path), pathname: path, uploadedAt: file.uploadedAt })),
      })),
      del: vi.fn(async (urls: string | string[]) => {
        for (const u of ([] as string[]).concat(urls)) files.delete(u.replace("https://store.test/", ""));
      }),
    },
  };
});

vi.mock("@vercel/blob", () => blob.api);

const { readContentDocument, resetSection, saveSection } = await import("@ofir/content/store");

beforeEach(() => {
  blob.reset();
  vi.clearAllMocks();
  process.env.BLOB_READ_WRITE_TOKEN = "test";
});

describe("almacenamiento del contenido", () => {
  it("sin nada guardado devuelve el documento vacío", async () => {
    await expect(readContentDocument()).resolves.toEqual({ version: 1, savedAt: null, sections: {} });
  });

  it("guarda cada sección sin pisar las demás", async () => {
    await saveSection("hero", { title: "Uno" }, "OFIR");
    await saveSection("cta", { title: "Dos" }, "Andrés");
    const doc = await readContentDocument();
    expect(doc.sections.hero).toMatchObject({ data: { title: "Uno" }, updatedBy: "OFIR" });
    expect(doc.sections.cta).toMatchObject({ data: { title: "Dos" }, updatedBy: "Andrés" });
    expect(doc.savedAt).not.toBeNull();
  });

  it("si otra persona guardó en el medio, reintenta sobre su versión", async () => {
    await saveSection("hero", { title: "Uno" }, "OFIR");
    // Justo antes de escribir, "otra persona" guarda la sección cta.
    blob.api.put.mockImplementationOnce(async () => {
      const current = JSON.parse(blob.files.get("cms/content.json")!.body);
      current.sections.cta = { data: { title: "De la otra persona" }, updatedAt: "", updatedBy: "Andrés" };
      blob.files.set("cms/content.json", { body: JSON.stringify(current), etag: "cambio-ajeno", uploadedAt: new Date() });
      throw new blob.BlobPreconditionFailedError();
    });
    await saveSection("faq", { title: "Mío" }, "OFIR");
    const doc = await readContentDocument();
    expect(Object.keys(doc.sections).sort()).toEqual(["cta", "faq", "hero"]);
  });

  it("restaurar quita la sección (vuelve a los textos originales)", async () => {
    await saveSection("hero", { title: "Uno" }, "OFIR");
    await resetSection("hero");
    expect((await readContentDocument()).sections.hero).toBeUndefined();
  });

  it("deja una copia por guardado y conserva solo las últimas 30", async () => {
    for (let i = 0; i < 33; i++) await saveSection("hero", { title: `v${i}` }, "OFIR");
    const history = [...blob.files.keys()].filter((path) => path.startsWith("cms/history/"));
    expect(history).toHaveLength(30);
  });

  it("sin token no intenta guardar", async () => {
    delete process.env.BLOB_READ_WRITE_TOKEN;
    await expect(saveSection("hero", {}, "OFIR")).rejects.toThrow(/BLOB_READ_WRITE_TOKEN/);
    await expect(readContentDocument()).resolves.toMatchObject({ sections: {} });
  });
});
