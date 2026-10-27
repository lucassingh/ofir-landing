import type { SiteContent } from "@ofir/content";
import { StatNumber, StatsDeck, StatCard } from "./StatsClient";

/** Color de cada tarjeta por posición (textos y números vienen del panel: solo datos reales). */
const tones = [
  { bg: "bg-azul text-white", sub: "text-on-azul-soft" },
  { bg: "bg-azul-2 text-white", sub: "text-white/80" },
  { bg: "bg-white text-azul", sub: "text-ink-soft" },
  { bg: "bg-grafito text-white", sub: "text-white/70" },
];

/** Datos reales (sin inventar métricas). Cards de color de la paleta, como bloques de acero. */
export function Stats({ content }: { content: SiteContent }) {
  const stats = content.stats.items.map((s, i) => ({ ...s, ...tones[i % tones.length] }));
  return (
    <section id="numeros" data-cms-section="stats" aria-label="OFIR en números" className="overflow-x-clip">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <StatsDeck total={stats.length} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <StatCard
            key={i}
            index={i}
            className={`flex min-h-[230px] flex-col justify-between rounded-[28px] p-7 shadow-card will-change-transform ${s.bg}`}
          >
            <p className={`max-w-[22ch] text-[15px] leading-snug ${s.sub}`}>{s.label}</p>
            <p className="font-display text-[3.6rem] font-extrabold leading-none [font-stretch:125%]">
              <StatNumber to={s.value} prefix={s.prefix} suffix={s.suffix} />
              {s.unit && <span className="ml-2 text-[1.3rem] font-bold [font-stretch:112%]">{s.unit}</span>}
            </p>
          </StatCard>
        ))}
      </StatsDeck>
      </div>
    </section>
  );
}
