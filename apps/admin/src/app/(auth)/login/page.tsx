import { Eye, ImageUp, Type } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { BrandGlow, BrandSymbolCutout } from "@/components/brand/brand-glow";
import { siteConfig } from "@/config/site";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Iniciar sesión" };

const capabilities = [
  { icon: Type, title: "Textos de cada sección", body: "Títulos, servicios, preguntas y datos de contacto." },
  { icon: ImageUp, title: "Fotos de obras", body: "Las subís desde la compu o el celular." },
  { icon: Eye, title: "Vista previa en vivo", body: "Ves la web real mientras escribís, antes de publicar." },
] as const;

const siteHost = siteConfig.siteUrl.replace(/^https?:\/\//, "");

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh bg-surface lg:grid-cols-[minmax(0,1.2fr)_minmax(28rem,0.8fr)]">
      {/* ── Bloque de marca: el mismo degradé del cierre de la web ── */}
      <section
        aria-labelledby="login-brand-title"
        className="relative isolate flex flex-col overflow-hidden bg-brand-azul-2 px-6 py-8 text-white sm:px-12 sm:py-10 lg:min-h-dvh lg:px-16 lg:py-12 xl:px-20"
      >
        <BrandGlow />
        <BrandSymbolCutout className="pointer-events-none absolute -bottom-40 -right-40 -z-10 w-[560px] text-white opacity-[0.07] lg:-bottom-56 lg:-right-56 lg:w-[760px]" />

        <Image
          src="/brand/ofir_horizontal_negativo.svg"
          alt="OFIR"
          width={149}
          height={36}
          priority
          unoptimized
          className="h-9 w-auto self-start animate-rise"
        />

        <div className="my-auto max-w-xl pt-10 lg:pt-0">
          <p className="flex animate-rise items-center gap-2.5 font-display text-xs font-semibold uppercase tracking-[0.2em] [animation-delay:80ms] [font-stretch:112%]">
            <span aria-hidden className="size-2 shrink-0 bg-brand-oro" />
            {siteConfig.tagline}
          </p>
          <h1
            id="login-brand-title"
            className="mt-5 animate-rise text-balance font-display text-[clamp(2.1rem,4.4vw,3.6rem)] font-extrabold leading-[1.02] tracking-[-0.012em] [animation-delay:140ms] stretch-expanded"
          >
            Tu web, al día. Sin tocar código.
          </h1>
          <p className="mt-5 hidden max-w-md animate-rise text-[17px] leading-relaxed [animation-delay:200ms] sm:block">
            Cambiá los textos y las fotos de {siteHost}. Ves cómo queda antes de guardar y se publica al instante.
          </p>

          <ul className="mt-10 hidden gap-3 sm:grid">
            {capabilities.map(({ icon: Icon, title, body }, i) => (
              <li
                key={title}
                className="flex animate-rise items-start gap-4 rounded-2xl bg-brand-azul-d/35 p-4 ring-1 ring-inset ring-white/10 backdrop-blur-[2px]"
                style={{ animationDelay: `${280 + i * 80}ms` }}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/12 ring-1 ring-inset ring-white/15">
                  <Icon aria-hidden className="size-[18px]" />
                </span>
                <span className="grid gap-0.5">
                  <span className="text-[15px] font-semibold">{title}</span>
                  <span className="text-sm leading-snug">{body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="hidden items-center gap-3 font-mono text-xs lg:flex">
          <span aria-hidden className="size-1.5 bg-brand-oro" />
          Ingeniería y oficio, a tu medida
        </p>
      </section>

      {/* ── Formulario ── */}
      <div className="flex flex-col px-6 py-10 sm:px-12 lg:px-14">
        <div className="m-auto w-full max-w-sm">
          <div className="space-y-2">
            <h2 className="font-display text-[1.75rem] font-bold leading-tight tracking-tight [font-stretch:112%]">
              Ingresá al panel
            </h2>
            <p className="text-sm text-muted-foreground">Con tu email y la contraseña del panel.</p>
          </div>

          <div className="mt-8">
            {/* ?next= es dato de la URL: se lee dentro de Suspense (Cache Components). */}
            <Suspense fallback={<LoginForm next="/" />}>
              <LoginForm />
            </Suspense>
          </div>

          <p className="mt-8 text-pretty text-xs leading-relaxed text-muted-foreground">
            No hay registro: el acceso es solo para las cuentas habilitadas. Si no podés entrar, pedile la contraseña a
            quien administra el panel.
          </p>
        </div>

        <a
          href={siteConfig.siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto mt-10 rounded font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {siteHost} ↗
        </a>
      </div>
    </main>
  );
}
