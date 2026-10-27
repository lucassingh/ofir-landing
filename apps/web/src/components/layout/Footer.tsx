import { Mail, MapPin, Phone } from "lucide-react";
import type { SiteContent } from "@ofir/content";
import { navLinks } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { InstagramIcon } from "@/components/ui/icons";

/** El año llega armado desde el servidor (ver currentYear en lib/content). */
export function Footer({ content, year }: { content: SiteContent; year: number }) {
  const { company, menu, services } = content;
  const nav = navLinks(menu);
  return (
    <footer data-cms-section="footer" className="relative mt-24 overflow-hidden">
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
              {services.cards.map((s, i) => (
                <li key={i}><a href="#servicios" className="text-grafito hover:text-azul">{s.kicker}</a></li>
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
              {company.phones.map((p) => (
                <li key={p.number}><a href={`tel:+${p.number}`} className="flex items-center gap-3 text-grafito hover:text-azul"><Phone className="size-4 text-azul-2" />{p.display}</a></li>
              ))}
              <li><a href={`mailto:${company.email}`} className="flex items-center gap-3 whitespace-nowrap text-grafito hover:text-azul"><Mail className="size-4 shrink-0 text-azul-2" />{company.email}</a></li>
              <li><a href={company.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-grafito hover:text-azul"><InstagramIcon className="size-4 text-azul-2" />{company.instagramHandle}</a></li>
              <li><a href={company.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-grafito hover:text-azul"><MapPin className="size-4 text-azul-2" />{company.addressStreet} · {company.addressCity}</a></li>
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
          <span className="sm:text-center">© {year} OFIR · {company.addressCity}, {company.addressRegion}</span>
          <span className="sm:text-right">{menu.footerTagline}</span>
        </div>
      </div>
    </footer>
  );
}
