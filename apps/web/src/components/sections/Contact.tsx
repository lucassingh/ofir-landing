import { Mail, Phone } from "lucide-react";
import { whatsappUrl, type SiteContent } from "@ofir/content";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { SlideIn } from "@/components/ui/SlideIn";

/** Contacto: card azul con datos + card blanca con el formulario (→ Resend). */
export function Contact({ content }: { content: SiteContent }) {
  const { contact, company } = content;
  const items = [
    // el número de WhatsApp ya está en el botón: no se repite en la lista
    ...company.phones.filter((p) => p.number !== company.whatsappNumber).map((p) => ({ icon: Phone, label: p.label, value: p.display, href: `tel:+${p.number}` })),
    { icon: Mail, label: "Email", value: company.email, href: `mailto:${company.email}` },
    { icon: InstagramIcon, label: "Instagram", value: company.instagramHandle, href: company.instagramUrl },
  ];
  return (
    <section id="contacto" data-cms-section="contact" aria-labelledby="contacto-title" className="overflow-x-clip">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <SlideIn from="left" className="relative flex flex-col gap-8 overflow-hidden rounded-[28px] bg-azul bg-plano p-8 text-on-azul-soft sm:p-10">
          <div className="grid gap-4">
            <Eyebrow tone="dark">{contact.eyebrow}</Eyebrow>
            <h2 id="contacto-title" className="font-display stretch-expanded text-[clamp(2rem,4vw,2.8rem)] font-extrabold leading-[1.03] text-white">
              {contact.title}
            </h2>
            <p className="text-[16px] leading-relaxed">{contact.description}</p>
          </div>
          <a href={whatsappUrl(company.whatsappNumber, company.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="inline-flex h-14 w-fit items-center gap-3 rounded-full bg-white px-6 font-semibold text-azul hover:bg-cal">
            <WhatsAppIcon /> WhatsApp {company.whatsappDisplay}
          </a>
          <ul className="mt-auto grid gap-1">
            {items.map(({ icon: Icon, label, value, href }) => {
              const inner = (
                <>
                  <Icon className="size-[18px] shrink-0 text-on-azul-soft" />
                  <span className="grid">
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-on-azul-soft/80">{label}</span>
                    <span className="break-all text-[15px] text-white">{value}</span>
                  </span>
                </>
              );
              return (
                <li key={label}>
                  {href ? (
                    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl px-3 py-2.5 hover:bg-white/5">{inner}</a>
                  ) : (
                    <div className="flex items-center gap-4 px-3 py-2.5">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </SlideIn>

        <SlideIn from="right" delay={0.1} className="relative flex flex-col justify-center rounded-[28px] bg-white p-6 shadow-card sm:p-8">
          <QuoteForm whatsappNumber={company.whatsappNumber} />
        </SlideIn>
      </div>
      </div>
    </section>
  );
}
