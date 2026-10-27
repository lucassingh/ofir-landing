import { site } from "@/content/site";
import { services } from "@/content/services";

/** Datos estructurados LocalBusiness para Google (aparece en búsquedas locales). */
export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: site.name,
    slogan: site.slogan,
    description: site.description,
    url: site.url,
    telephone: "+543462549129",
    email: site.email,
    image: `${site.url}/brand/ofir_horizontal_color.svg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    areaServed: site.area,
    sameAs: [site.instagram.url],
    makesOffer: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title } })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
