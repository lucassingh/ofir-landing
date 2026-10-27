import { StatNumber, StatsDeck, StatCard } from "./StatsClient";

/**
 * Datos reales (sin inventar métricas). Cards de color de la paleta, como bloques de acero.
 * Si OFIR da más datos verificables (años de oficio, obras), se suman acá.
 */
const stats = [
  { value: 10, prefix: "", suffix: "", unit: "años", label: "de garantía en impermeabilización, según el sistema", bg: "bg-azul text-white", sub: "text-on-azul-soft" },
  { value: 3, prefix: "", suffix: "", unit: "frentes", label: "industria, herrería y revestimientos en un solo taller", bg: "bg-azul-2 text-white", sub: "text-white/80" },
  { value: 0, prefix: "$", suffix: "", unit: "", label: "cuesta el presupuesto: medimos y asesoramos sin cargo", bg: "bg-white text-azul", sub: "text-ink-soft" },
  { value: 100, prefix: "", suffix: "%", unit: "", label: "fotos reales: todo lo que ves acá lo hicimos nosotros", bg: "bg-grafito text-white", sub: "text-white/70" },
];

export function Stats() {
  return (
    <section aria-label="OFIR en números" className="overflow-x-clip">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <StatsDeck total={stats.length} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <StatCard
            key={s.label}
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
