import { ArrowUpRight, CircleAlert, PencilLine } from "lucide-react";
import Link from "next/link";
import { SECTION_ORDER, SECTIONS, type SectionArea, type SectionKey } from "@ofir/content";
import { PageBody, PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TodayLabel } from "@/components/views/today-label";
import { sectionHref, sectionIcons } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { requireUser } from "@/lib/auth";
import { loadContent, type StoreStatus } from "@/lib/cms";
import { formatRelativeTime } from "@/lib/format";
import { getRouteMetadata } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export const metadata = getRouteMetadata("/");

const AREAS: { area: SectionArea; title: string; help: string }[] = [
  { area: "page", title: "Página de inicio", help: "En el mismo orden en que aparecen al hacer scroll." },
  { area: "global", title: "Datos generales", help: "Se usan en varios lugares de la web a la vez." },
];

export default async function HomePage() {
  const user = await requireUser();
  const { doc, status } = await loadContent();

  const edited = SECTION_ORDER.filter((key) => doc.sections[key]);
  const latest = edited
    .map((key) => ({ key, ...doc.sections[key]! }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];

  return (
    <>
      <PageHeader
        eyebrow={<TodayLabel />}
        title={`Hola, ${user.name}`}
        description="Elegí qué parte de la web querés cambiar. Editás, ves cómo queda y publicás: la web se actualiza al instante."
      />
      <PageBody>
        {status !== "ready" && <StoreBanner status={status} />}

        <Card className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <Summary label="Secciones con cambios">
            <span className="font-display text-2xl font-bold tabular-nums [font-stretch:112%]">{edited.length}</span>
            <span className="text-sm text-muted-foreground">de {SECTION_ORDER.length}</span>
          </Summary>
          <Summary label="Último cambio">
            {latest ? (
              <span className="text-sm">
                <Link href={sectionHref(latest.key)} className="font-medium underline decoration-border-strong underline-offset-4 hover:decoration-foreground">
                  {SECTIONS[latest.key].navLabel}
                </Link>
                <span className="text-muted-foreground">
                  {" "}
                  · {formatRelativeTime(latest.updatedAt)} · {latest.updatedBy}
                </span>
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">Todavía no se editó nada</span>
            )}
          </Summary>
          <Summary label="Almacenamiento">
            <Badge variant={status === "ready" ? "success" : status === "missing" ? "warning" : "danger"} dot>
              {status === "ready" ? "Conectado" : status === "missing" ? "Sin conectar" : "Con errores"}
            </Badge>
          </Summary>
        </Card>

        {AREAS.map(({ area, title, help }) => {
          const keys = SECTION_ORDER.filter((key) => SECTIONS[key].area === area);
          return (
            <section key={area} aria-labelledby={`area-${area}`} className="space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 id={`area-${area}`} className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  {title}
                </h2>
                <p className="text-xs text-muted-foreground">{help}</p>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                {keys.map((key, i) => (
                  <li key={key} className="animate-page-enter" style={{ animationDelay: `${i * 35}ms` }}>
                    <SectionCard sectionKey={key} number={i + 1} record={doc.sections[key]} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </PageBody>
    </>
  );
}

function Summary({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5 px-5 py-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="flex min-h-8 items-baseline gap-1">{children}</div>
    </div>
  );
}

function SectionCard({
  sectionKey,
  number,
  record,
}: {
  sectionKey: SectionKey;
  number: number;
  record?: { updatedAt: string; updatedBy: string };
}) {
  const def = SECTIONS[sectionKey];
  const Icon = sectionIcons[sectionKey];
  return (
    <Card className="group relative flex h-full flex-col gap-3 p-5 transition-[border-color,box-shadow,translate] duration-200 ease-snappy focus-within:border-primary/40 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-popover">
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/8 text-primary ring-1 ring-inset ring-primary/12 dark:text-foreground">
          <Icon aria-hidden className="size-5" />
        </span>
        <Badge variant={record ? "primary" : "outline"} dot={Boolean(record)}>
          {record ? "Con cambios" : "Original"}
        </Badge>
      </div>

      <div className="space-y-1">
        <p aria-hidden className="font-mono text-[11px] text-muted-foreground">
          {String(number).padStart(2, "0")}
        </p>
        <h3 className="font-display text-[1.05rem] font-bold leading-snug [font-stretch:108%]">
          {/* el link cubre toda la tarjeta */}
          <Link
            href={sectionHref(sectionKey)}
            className="rounded-sm after:absolute after:inset-0 after:rounded-xl after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-offset-2 focus-visible:after:ring-offset-canvas"
          >
            {def.label}
          </Link>
        </h3>
        <p className="line-clamp-2 text-pretty text-[13px] leading-relaxed text-muted-foreground">{def.description}</p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3">
        <p className={cn("truncate text-xs", record ? "text-foreground" : "text-muted-foreground")}>
          {record ? `${formatRelativeTime(record.updatedAt)} · ${record.updatedBy}` : "Sin cambios todavía"}
        </p>
        <div className="relative z-10 flex shrink-0 items-center gap-1">
          <a
            href={`${siteConfig.siteUrl}${def.href}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            En la web
            <ArrowUpRight aria-hidden className="size-3.5" />
            <span className="sr-only">: {def.label} (se abre en otra pestaña)</span>
          </a>
          <span
            aria-hidden
            className="inline-flex h-7 items-center gap-1 rounded-md bg-primary px-2.5 text-xs font-medium text-primary-foreground transition-[background-color] group-hover:bg-primary/90"
          >
            <PencilLine className="size-3.5" />
            Editar
          </span>
        </div>
      </div>
    </Card>
  );
}

function StoreBanner({ status }: { status: Exclude<StoreStatus, "ready"> }) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3.5 text-sm",
        status === "error" ? "border-danger/30 bg-danger/6" : "border-warning/30 bg-warning/8",
      )}
    >
      <CircleAlert aria-hidden className={cn("mt-0.5 size-4 shrink-0", status === "error" ? "text-danger" : "text-warning")} />
      <div className="space-y-1">
        <p className="font-medium">{status === "error" ? "No pudimos leer lo publicado" : "Falta conectar el almacenamiento"}</p>
        <p className="text-pretty text-muted-foreground">
          {status === "error"
            ? "Probá recargar en un momento. Mientras tanto no se puede guardar, para no pisar lo que ya está en la web."
            : "Se ven los textos originales. Para guardar cambios hay que conectar Vercel Blob al proyecto del panel (BLOB_READ_WRITE_TOKEN)."}
        </p>
      </div>
    </div>
  );
}
