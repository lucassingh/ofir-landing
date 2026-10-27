import { Plus } from "lucide-react";
import type { SiteContent } from "@ofir/content";
import { jsonLd } from "@/lib/json-ld";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Preguntas frecuentes con <details> nativo (accesible, sin JS) + FAQPage JSON-LD para SEO. */
export function Faq({ content }: { content: SiteContent }) {
  const { faq } = content;
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
  return (
    <section id="preguntas" data-cms-section="faq" aria-labelledby="faq-title" className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:py-28">
      <SectionHeading className="self-start lg:sticky lg:top-28" id="faq-title" eyebrow={faq.eyebrow} title={faq.title} lede={faq.lede} />
      <div className="grid gap-3">
        {faq.items.map((f, i) => (
          <details key={i} className="faq-item group rounded-[22px] bg-white px-6 pt-6 pb-6 shadow-card">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-[1.1rem] font-bold text-azul [font-stretch:108%] [&::-webkit-details-marker]:hidden">
              {f.question}
              <Plus aria-hidden className="size-5 shrink-0 text-azul-2 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-open:rotate-45" />
            </summary>
            <p className="faq-answer max-w-prose pt-3 pb-1 text-[16px] leading-relaxed text-ink-soft">{f.answer}</p>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />
    </section>
  );
}
