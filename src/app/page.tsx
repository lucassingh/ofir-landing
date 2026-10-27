import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Services } from "@/components/sections/Services";
import { Stats } from "@/components/sections/Stats";
import { Projects } from "@/components/sections/Projects";
import { Process } from "@/components/sections/Process";
import { Mission } from "@/components/sections/Mission";
import { Faq } from "@/components/sections/Faq";
import { CtaBand } from "@/components/sections/CtaBand";
import { Contact } from "@/components/sections/Contact";

/** Landing de una página. Orden y objetivo de cada sección: ../docs/landing-ofir.md */
export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Services />
      <Stats />
      <Projects />
      <Process />
      <Mission />
      <Faq />
      <CtaBand />
      <Contact />
    </>
  );
}
