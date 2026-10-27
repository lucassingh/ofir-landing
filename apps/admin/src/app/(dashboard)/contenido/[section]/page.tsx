import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isSectionKey, mergeSectionContent, SECTION_ORDER, SECTIONS } from "@ofir/content";
import { SectionEditor } from "@/components/content/section-editor";
import { PageBody, PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { sectionHref } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { requireUser } from "@/lib/auth";
import { loadContent, siteContentOf } from "@/lib/cms";

export async function generateMetadata({ params }: PageProps<"/contenido/[section]">): Promise<Metadata> {
  const { section } = await params;
  return { title: isSectionKey(section) ? SECTIONS[section].label : "Sección" };
}

const AREA_EYEBROW = { page: "Página de inicio", global: "Datos generales" } as const;

export default async function SectionPage({ params }: PageProps<"/contenido/[section]">) {
  await requireUser();
  const { section } = await params;
  if (!isSectionKey(section)) notFound();

  const def = SECTIONS[section];
  const { doc, status } = await loadContent();
  const record = doc.sections[section];

  const sameArea = SECTION_ORDER.filter((key) => SECTIONS[key].area === def.area);
  const position = String(sameArea.indexOf(section) + 1).padStart(2, "0");
  const index = SECTION_ORDER.indexOf(section);
  const prev = SECTION_ORDER[index - 1];
  const next = SECTION_ORDER[index + 1];

  return (
    <>
      <PageHeader
        eyebrow={`${AREA_EYEBROW[def.area]} · ${position} de ${String(sameArea.length).padStart(2, "0")}`}
        title={def.label}
        description={def.description}
        actions={
          <>
            <div className="flex items-center gap-1">
              {prev && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href={sectionHref(prev)}>
                    <ArrowLeft aria-hidden />
                    <span className="sr-only">Sección anterior:</span>
                    {SECTIONS[prev].navLabel}
                  </Link>
                </Button>
              )}
              {next && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href={sectionHref(next)}>
                    <span className="sr-only">Sección siguiente:</span>
                    {SECTIONS[next].navLabel}
                    <ArrowRight aria-hidden />
                  </Link>
                </Button>
              )}
            </div>
            <Button variant="outline" asChild>
              <a href={`${siteConfig.siteUrl}${def.href}`} target="_blank" rel="noopener noreferrer">
                Ver en la web
                <ExternalLink aria-hidden />
                <span className="sr-only">(se abre en otra pestaña)</span>
              </a>
            </Button>
          </>
        }
      />
      <PageBody>
        <SectionEditor
          // remonta el formulario al pasar a otra sección
          key={section}
          sectionKey={section}
          initialValues={mergeSectionContent(section, record?.data) as unknown as Record<string, unknown>}
          siteContent={siteContentOf(doc)}
          meta={{ updatedAt: record?.updatedAt ?? null, updatedBy: record?.updatedBy ?? null }}
          customized={Boolean(record)}
          storeStatus={status}
        />
      </PageBody>
    </>
  );
}
