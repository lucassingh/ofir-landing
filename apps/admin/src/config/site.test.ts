// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { toOrigin } from "@ofir/content/preview";

describe("toOrigin", () => {
  it("acepta la URL como sea que la hayan cargado en Vercel", () => {
    expect(toOrigin("https://ofirsolucionesintegrales.com")).toBe("https://ofirsolucionesintegrales.com");
    expect(toOrigin("https://ofirsolucionesintegrales.com/")).toBe("https://ofirsolucionesintegrales.com");
    expect(toOrigin("ofirsolucionesintegrales.com")).toBe("https://ofirsolucionesintegrales.com");
    expect(toOrigin(' "https://admin.ofirsolucionesintegrales.com" ')).toBe("https://admin.ofirsolucionesintegrales.com");
    expect(toOrigin("http://localhost:3000")).toBe("http://localhost:3000");
  });

  it("devuelve null si no sirve (en vez de romper la app al cargar)", () => {
    expect(toOrigin(undefined)).toBeNull();
    expect(toOrigin("")).toBeNull();
    expect(toOrigin("   ")).toBeNull();
    expect(toOrigin("https://")).toBeNull();
    expect(toOrigin("no es una url")).toBeNull();
  });
});

describe("siteConfig.siteUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  const load = async (value: string) => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", value);
    vi.resetModules();
    return (await import("./site")).siteConfig.siteUrl;
  };

  it("con un valor vacío o inválido usa la web de producción", async () => {
    await expect(load("")).resolves.toBe("https://ofirsolucionesintegrales.com");
    await expect(load("no es una url")).resolves.toBe("https://ofirsolucionesintegrales.com");
  });

  it("normaliza el valor cargado", async () => {
    await expect(load("ofirsolucionesintegrales.com/")).resolves.toBe("https://ofirsolucionesintegrales.com");
  });
});
