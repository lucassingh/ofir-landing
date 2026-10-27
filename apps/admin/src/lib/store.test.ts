// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Vercel Blob en memoria: list / put / del, y fetch para leer las URLs públicas.
const blob = vi.hoisted(() => {
  const files = new Map<string, { body: string; uploadedAt: Date }>();
  let counter = 0;
  const url = (path: string) => `https://store.test/${path}`;
  const store = (path: string, body: string) => {
    files.set(path, { body, uploadedAt: new Date(Date.now() + ++counter) });
    return { url: url(path), pathname: path };
  };
  return {
    files,
    store,
    reset: () => {
      files.clear();
      counter = 0;
    },
    api: {
      put: vi.fn(async (path: string, body: string, options: { addRandomSuffix?: boolean }) => {
        const finalPath = options.addRandomSuffix ? path.replace(/\.json$/, `-r${++counter}.json`) : path;
        if (files.has(finalPath)) throw new Error("ya existe");
        return store(finalPath, body);
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
    fetch: vi.fn(async (u: string) => {
      const file = files.get(u.replace("https://store.test/", ""));
      return file ? new Response(file.body) : new Response("no existe", { status: 404 });
    }),
  };
});

vi.mock("@vercel/blob", () => blob.api);

const { readContentDocument, resetSection, saveSection } = await import("@ofir/content/store");

const versions = () => [...blob.files.keys()].filter((path) => path.startsWith("cms/content/"));

beforeEach(() => {
  blob.reset();
  vi.clearAllMocks();
  vi.stubGlobal("fetch", blob.fetch);
  process.env.BLOB_READ_WRITE_TOKEN = "test";
});

afterEach(() => vi.unstubAllGlobals());

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

  it("nunca sobrescribe: cada guardado es un archivo nuevo (el CDN no puede servir una copia vieja)", async () => {
    await saveSection("hero", { title: "Uno" }, "OFIR");
    await saveSection("hero", { title: "Dos" }, "OFIR");
    expect(versions()).toHaveLength(2);
    for (const [, , options] of blob.api.put.mock.calls) {
      expect(options).toMatchObject({ addRandomSuffix: true });
      expect(options).not.toHaveProperty("allowOverwrite");
    }
    expect((await readContentDocument()).sections.hero?.data).toEqual({ title: "Dos" });
  });

  it("si otra persona guardó en el medio, la última versión tiene los dos cambios", async () => {
    await saveSection("hero", { title: "Base" }, "OFIR");
    // Justo después de nuestra escritura aparece una versión de "otra persona" hecha sobre la base vieja.
    const base = JSON.parse(blob.files.get(versions()[0]!)!.body);
    blob.api.put.mockImplementationOnce(async (path: string, body: string) => {
      const ours = blob.store(path.replace(/\.json$/, "-nuestra.json"), body);
      const theirs = { ...base, sections: { ...base.sections, cta: { data: { title: "De la otra persona" }, updatedAt: "", updatedBy: "Andrés" } } };
      blob.store(path.replace(/\.json$/, "-zz-ajena.json"), JSON.stringify(theirs));
      return ours;
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

  it("conserva solo las últimas 30 versiones como historial", async () => {
    for (let i = 0; i < 33; i++) await saveSection("hero", { title: `v${i}` }, "OFIR");
    expect(versions()).toHaveLength(30);
    expect((await readContentDocument()).sections.hero?.data).toEqual({ title: "v32" });
  });

  it("sin token no intenta guardar", async () => {
    delete process.env.BLOB_READ_WRITE_TOKEN;
    await expect(saveSection("hero", {}, "OFIR")).rejects.toThrow(/BLOB_READ_WRITE_TOKEN/);
    await expect(readContentDocument()).resolves.toMatchObject({ sections: {} });
  });
});
