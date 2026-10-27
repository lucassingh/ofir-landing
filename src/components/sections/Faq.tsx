import { Plus } from "lucide-react";
import { faq } from "@/content/faq";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Preguntas frecuentes con <details> nativo (accesible, sin JS) + FAQPage JSON-LD para SEO. */
export function Faq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <section id="preguntas" aria-labelledby="faq-title" className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:py-28">
      <SectionHeading className="self-start lg:sticky lg:top-28" id="faq-title" eyebrow="Preguntas" title="Lo que más nos preguntan." lede="Si tenés otra duda, escribinos y te respondemos." />
      <div className="grid gap-3">
        {faq.map((f) => (
          <details key={f.q} className="faq-item group rounded-[22px] bg-white px-6 pt-6 pb-6 shadow-card">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-[1.1rem] font-bold text-azul [font-stretch:108%] [&::-webkit-details-marker]:hidden">
              {f.q}
              <Plus aria-hidden className="size-5 shrink-0 text-azul-2 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-open:rotate-45" />
            </summary>
            <p className="faq-answer max-w-prose pt-3 pb-1 text-[16px] leading-relaxed text-ink-soft">{f.a}</p>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
