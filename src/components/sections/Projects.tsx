import { projects, photosOf } from "@/content/projects";
import { services } from "@/content/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectsGallery } from "./ProjectsGallery";

/** Portfolio de obras reales. Los datos se arman en el servidor; el filtro y el visor son cliente. */
export function Projects() {
  const items = projects
    .filter((p) => p.publicable)
    .map((p) => ({ ...p, photos: photosOf(p.slug), coverSrc: `/proyectos/${p.slug}/${p.cover}` }));
  const filters = [{ id: "todas", label: "Todas" }, ...services.map((s) => ({ id: s.id, label: s.kicker }))];

  return (
    <section id="obras" aria-labelledby="obras-title" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
      <SectionHeading
        id="obras-title"
        eyebrow="Obras"
        title="Trabajos reales, hechos en el taller."
        lede="Cada foto es un trabajo nuestro. Tocá una obra para ver más."
      />
      <ProjectsGallery items={items} filters={filters} />
    </section>
  );
}
