import { Mail, MapPin, Phone } from "lucide-react";
import { nav, site } from "@/content/site";
import { services } from "@/content/services";
import { Logo } from "@/components/ui/Logo";
import { InstagramIcon } from "@/components/ui/icons";

/** Año cacheado en el build (Cache Components no permite `new Date()` suelto al prerenderizar). */
async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function Footer() {
  const year = await currentYear();
  return (
    <footer className="relative mt-24 overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 pb-10 sm:px-8">
        <div className="grid gap-10 border-t border-line-2 pt-14 md:grid-cols-2 lg:grid-cols-[1.4fr_0.75fr_0.85fr_1.5fr]">
          <div className="content-start">
            <a href="#" aria-label="OFIR, volver arriba" className="inline-block">
              <Logo variant="horizontal" height={72} />
            </a>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">Servicios</h3>
            <ul className="grid gap-2.5 text-[15px]">
              {services.map((s) => (
                <li key={s.id}><a href="#servicios" className="text-grafito hover:text-azul">{s.kicker}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">Navegación</h3>
            <ul className="grid gap-2.5 text-[15px]">
              {nav.map((n) => (
                <li key={n.href}><a href={n.href} className="text-grafito hover:text-azul">{n.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">Contacto</h3>
            <ul className="grid gap-3 text-[15px]">
              {site.phones.map((p) => (
                <li key={p.href}><a href={p.href} className="flex items-center gap-3 text-grafito hover:text-azul"><Phone className="size-4 text-azul-2" />{p.display}</a></li>
              ))}
              <li><a href={`mailto:${site.email}`} className="flex items-center gap-3 whitespace-nowrap text-grafito hover:text-azul"><Mail className="size-4 shrink-0 text-azul-2" />{site.email}</a></li>
              <li><a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-grafito hover:text-azul"><InstagramIcon className="size-4 text-azul-2" />{site.instagram.handle}</a></li>
              <li><a href={site.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-grafito hover:text-azul"><MapPin className="size-4 text-azul-2" />{site.address.street} · {site.address.city}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 grid gap-3 border-t border-line pt-6 font-mono text-[12px] text-ink-soft sm:grid-cols-3 sm:items-center">
          <span>
            Desarrollado por{" "}
            <a href="https://masuno.io/" target="_blank" rel="noopener noreferrer" className="font-medium text-azul-2 underline decoration-azul-2/40 underline-offset-4 transition-colors hover:text-azul hover:decoration-azul">
              +uno
            </a>
          </span>
          <span className="sm:text-center">© {year} OFIR · {site.address.city}, {site.address.region}</span>
          <span className="sm:text-right">Cada unión, bien hecha.</span>
        </div>
      </div>
    </footer>
  );
}
