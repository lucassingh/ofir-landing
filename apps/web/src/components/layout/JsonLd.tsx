import type { SiteContent } from "@ofir/content";
import { site } from "@/content/site";
import { jsonLd } from "@/lib/json-ld";

/** Datos estructurados LocalBusiness para Google (aparece en búsquedas locales). */
export function LocalBusinessJsonLd({ content }: { content: SiteContent }) {
  const { company, seo, services } = content;
  const data = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: site.name,
    slogan: site.slogan,
    description: seo.description,
    url: site.url,
    telephone: `+${company.phones[0]?.number ?? company.whatsappNumber}`,
    email: company.email,
    image: `${site.url}/brand/ofir_horizontal_color.svg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.addressStreet,
      addressLocality: company.addressCity,
      addressRegion: company.addressRegion,
      addressCountry: "AR",
    },
    areaServed: company.area,
    sameAs: [company.instagramUrl],
    makesOffer: services.cards.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title } })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />;
}
