// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  buildPreviewContent,
  buildSiteContent,
  DEFAULT_SITE_CONTENT,
  emptyListItem,
  getSectionSchema,
  mergeSectionContent,
  sectionFields,
  SECTION_ORDER,
  SECTIONS,
  type ListField,
} from "@ofir/content";

describe("registro de secciones (packages/content)", () => {
  it.each(SECTION_ORDER)("los textos originales de %s pasan su propia validación", (key) => {
    const result = getSectionSchema(key).safeParse(SECTIONS[key].defaults);
    expect(result.success, JSON.stringify(result.error?.issues, null, 2)).toBe(true);
  });

  it("cada sección declara campos para todas las claves de sus defaults (y viceversa)", () => {
    for (const key of SECTION_ORDER) {
      const fieldKeys = sectionFields(key).map((f) => f.key).sort();
      expect(Object.keys(SECTIONS[key].defaults).sort(), key).toEqual(fieldKeys);
    }
  });

  it("las listas de largo fijo tienen tantos defaults como ítems", () => {
    for (const key of SECTION_ORDER) {
      for (const field of sectionFields(key)) {
        if (field.kind !== "list") continue;
        const items = (SECTIONS[key].defaults as unknown as Record<string, unknown[]>)[field.key]!;
        expect(items.length, `${key}.${field.key}`).toBeGreaterThanOrEqual(field.min);
        expect(items.length, `${key}.${field.key}`).toBeLessThanOrEqual(field.max);
      }
    }
  });
});

describe("mergeSectionContent", () => {
  it("sin nada guardado usa los textos originales", () => {
    expect(mergeSectionContent("cta", undefined)).toEqual(SECTIONS.cta.defaults);
  });

  it("completa con los defaults los campos que falten", () => {
    const merged = mergeSectionContent("cta", { title: "¿Arrancamos?" });
    expect(merged.title).toBe("¿Arrancamos?");
    expect(merged.formLabel).toBe(SECTIONS.cta.defaults.formLabel);
  });

  it("si lo guardado no valida, la sección vuelve a sus originales (la web nunca se rompe)", () => {
    expect(mergeSectionContent("cta", { title: "x".repeat(500) })).toEqual(SECTIONS.cta.defaults);
    expect(mergeSectionContent("faq", { items: "no es una lista" })).toEqual(SECTIONS.faq.defaults);
  });

  it("rechaza links que no son https y teléfonos con letras", () => {
    expect(getSectionSchema("company").safeParse({ ...SECTIONS.company.defaults, instagramUrl: "javascript:alert(1)" }).success).toBe(false);
    expect(getSectionSchema("company").safeParse({ ...SECTIONS.company.defaults, whatsappNumber: "+54 3462" }).success).toBe(false);
  });
});

describe("buildSiteContent y buildPreviewContent", () => {
  it("arma la web completa con lo guardado", () => {
    const content = buildSiteContent({ hero: { ...SECTIONS.hero.defaults, title: "Nuevo título" } });
    expect(content.hero.title).toBe("Nuevo título");
    expect(content.faq).toEqual(DEFAULT_SITE_CONTENT.faq);
  });

  it("la vista previa acepta datos a medio escribir sin romperse", () => {
    const preview = buildPreviewContent({
      hero: { title: "", rotatingTexts: "roto" },
      projects: { items: [{ title: "Obra nueva" }] },
      stats: null,
    });
    expect(preview.hero.title).toBe("");
    expect(preview.hero.rotatingTexts).toEqual(SECTIONS.hero.defaults.rotatingTexts);
    expect(preview.projects.items[0]).toMatchObject({ title: "Obra nueva", photos: [], visible: true });
    expect(preview.stats).toEqual(SECTIONS.stats.defaults);
  });
});

describe("emptyListItem", () => {
  it("arma un ítem nuevo con la forma de la lista", () => {
    const projects = sectionFields("projects").find((f): f is ListField => f.kind === "list")!;
    expect(emptyListItem(projects.fields)).toEqual({ visible: true, title: "", service: "industria", summary: "", photos: [] });
  });
});
