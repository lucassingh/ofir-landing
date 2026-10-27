import { whatsappUrl, type SiteContent } from "@ofir/content";
import { navLinks } from "@/content/site";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FloatingDock } from "./FloatingDock";

/** Lo que rodea a las secciones: navbar, pie y botones flotantes. Lo comparten la web y la vista previa. */
export function SiteChrome({ content, year, children }: { content: SiteContent; year: number; children: React.ReactNode }) {
  const { company, menu } = content;
  const whatsappHref = whatsappUrl(company.whatsappNumber, company.whatsappMessage);
  return (
    <>
      <Navbar links={navLinks(menu)} ctaLabel={menu.ctaLabel} whatsappHref={whatsappHref} />
      <main id="contenido">{children}</main>
      <Footer content={content} year={year} />
      <FloatingDock
        instagram={{ url: company.instagramUrl, handle: company.instagramHandle }}
        whatsapp={{ href: whatsappHref, display: company.whatsappDisplay }}
      />
    </>
  );
}
