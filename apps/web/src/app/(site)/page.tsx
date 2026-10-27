import { LandingSections } from "@/components/sections/LandingSections";
import { getSiteContent } from "@/lib/content";

/** Landing de una página. Orden y objetivo de cada sección: ../../docs/landing-ofir.md */
export default async function Home() {
  const content = await getSiteContent();
  return <LandingSections content={content} />;
}
