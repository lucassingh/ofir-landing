import type { SiteContent } from "@ofir/content";
import { Hero } from "./Hero";
import { Marquee } from "./Marquee";
import { Services } from "./Services";
import { Stats } from "./Stats";
import { Projects } from "./Projects";
import { Process } from "./Process";
import { Mission } from "./Mission";
import { Faq } from "./Faq";
import { CtaBand } from "./CtaBand";
import { Contact } from "./Contact";

/**
 * Las secciones en orden. Cada una lleva `data-cms-section` con su clave del
 * panel: la vista previa la usa para llevar la pantalla a la parte que se edita.
 */
export function LandingSections({ content }: { content: SiteContent }) {
  return (
    <>
      <Hero content={content} />
      <Marquee lines={[content.marquee.line1, content.marquee.line2]} />
      <Services content={content} />
      <Stats content={content} />
      <Projects content={content} />
      <Process content={content} />
      <Mission content={content} />
      <Faq content={content} />
      <CtaBand content={content} />
      <Contact content={content} />
    </>
  );
}
