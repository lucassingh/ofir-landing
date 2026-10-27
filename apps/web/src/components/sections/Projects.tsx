import { SERVICE_IDS, type SiteContent } from "@ofir/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectsGallery } from "./ProjectsGallery";

/** Portfolio de obras reales. Los datos se arman en el servidor; el filtro y el visor son cliente. */
export function Projects({ content }: { content: SiteContent }) {
  const { projects, services } = content;
  // la key sale de la posición en la lista completa: no cambia al filtrar
  const items = projects.items
    .map((p, i) => ({ ...p, key: `${i}-${p.title}` }))
    .filter((p) => p.visible && p.photos.length > 0);
  const filters = [{ id: "todas", label: "Todas" }, ...SERVICE_IDS.map((id, i) => ({ id, label: services.cards[i]?.kicker ?? id }))];

  return (
    <section id="obras" data-cms-section="projects" aria-labelledby="obras-title" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
      <SectionHeading
        id="obras-title"
        eyebrow={projects.eyebrow}
        title={projects.title}
        lede={projects.lede}
      />
      <ProjectsGallery items={items} filters={filters} />
    </section>
  );
}
