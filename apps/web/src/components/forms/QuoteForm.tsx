"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { AlertTriangle, ArrowRight, Loader2, RotateCcw } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { enviarPresupuesto } from "@/app/actions/presupuesto";
import { SERVICIOS, CONTACTO, type QuoteState } from "@/lib/quote-schema";
import { whatsappUrl } from "@ofir/content";
import { usePreviewMode } from "@/components/preview/PreviewMode";
import { cn } from "@/lib/cn";
import { WhatsAppIcon } from "@/components/ui/icons";

const initial: QuoteState = { status: "idle" };

const field =
  "h-11 w-full rounded-[14px] border border-line-2 bg-page/60 px-3.5 text-[15px] text-grafito placeholder:text-gris transition-colors focus:border-azul-2 focus:bg-white focus:outline-none aria-[invalid=true]:border-[#C2553A] aria-[invalid=true]:bg-[#FBF3F0]";

function Label({ htmlFor, children, optional }: { htmlFor: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 flex items-baseline justify-between text-[13.5px] font-medium text-grafito">
      {children}
      {optional && <span className="font-mono text-[11px] font-normal text-ink-soft">opcional</span>}
    </label>
  );
}

function FieldError({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return <p id={id} role="alert" className="mt-1.5 text-[13px] text-[#9A3A22]">{msg}</p>;
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-azul px-7 text-[16px] font-semibold text-white transition-colors hover:bg-azul-d disabled:opacity-70 sm:w-auto"
    >
      {pending ? <><Loader2 className="size-5 animate-spin" /> Enviando…</> : <>Pedir presupuesto <ArrowRight className="size-5" /></>}
    </button>
  );
}

/**
 * Formulario de presupuesto. Funciona sin JS (Server Action + progressive enhancement).
 * La validación real está en el servidor (zod); acá van atributos HTML para ayudar.
 */
export function QuoteForm({ whatsappNumber }: { whatsappNumber: string }) {
  // la key remonta el formulario limpio para "Enviar otro pedido"
  const [ronda, setRonda] = useState(0);
  return <QuoteFormInner key={ronda} whatsappNumber={whatsappNumber} onReset={() => setRonda((r) => r + 1)} />;
}

/** Arma un mensaje de WhatsApp con lo que la persona ya cargó, para no perder el pedido si falla el envío. */
function pedidoPorWhatsApp(whatsappNumber: string, v: Record<string, string>) {
  const servicio = SERVICIOS.find((s) => s.value === v.servicio)?.label;
  const lineas = [
    "Hola OFIR, quiero pedir un presupuesto.",
    v.nombre && `Soy ${v.nombre}${v.localidad ? `, de ${v.localidad}` : ""}.`,
    servicio && `Servicio: ${servicio}.`,
    v.mensaje && `Trabajo: ${v.mensaje}`,
    v.medidas && `Medidas: ${v.medidas}`,
  ].filter(Boolean);
  return whatsappUrl(whatsappNumber, lineas.join("\n"));
}

function SuccessPanel({ nombre, contacto, conEmail, whatsappNumber, onReset }: { nombre: string; contacto?: string; conEmail?: boolean; whatsappNumber: string; onReset: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => ref.current?.focus(), []);
  const via = contacto === "email" ? "por email" : "por WhatsApp";
  const pasos = ["Revisamos tu pedido", `Te contactamos ${via} para coordinar`, "Medimos y te pasamos el presupuesto sin cargo"];
  return (
    <motion.div
      ref={ref}
      tabIndex={-1}
      role="status"
      initial={reduce ? false : { opacity: 0, y: 16, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="grid min-h-[460px] content-center justify-items-center gap-5 p-4 text-center outline-none"
    >
      <svg viewBox="0 0 64 64" className="size-16" aria-hidden>
        <circle cx="32" cy="32" r="30" fill="#16324F" />
        <motion.path
          d="M20 33l8 8 16-18"
          fill="none"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
        />
        <rect x="52" y="4" width="8" height="8" fill="#B8862B" />
      </svg>
      <div className="grid gap-2">
        <h3 className="font-display text-[1.6rem] font-bold leading-tight text-azul [font-stretch:112%]">¡Listo, {nombre.split(" ")[0]}! Recibimos tu pedido.</h3>
        <p className="mx-auto max-w-sm text-[15px] leading-relaxed text-ink-soft">
          Te respondemos en el día hábil.{conEmail ? " Te mandamos una confirmación a tu email (si no la ves, fijate en spam)." : ""}
        </p>
      </div>
      <ol className="grid w-full max-w-sm gap-2 text-left">
        {pasos.map((p, i) => (
          <li key={p} className="flex items-center gap-3 rounded-[14px] bg-page px-4 py-2.5 text-[14px] text-grafito">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white font-mono text-[12px] text-azul ring-1 ring-line-2">{i + 1}</span>
            {p}
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-1">
        <a href={whatsappUrl(whatsappNumber, "Hola OFIR, recién les mandé un pedido de presupuesto por la web.")} target="_blank" rel="noopener noreferrer" className="font-mono text-[13px] text-azul-2 underline underline-offset-4 hover:text-azul">
          ¿Es urgente? Escribinos por WhatsApp
        </a>
        <button type="button" onClick={onReset} className="inline-flex items-center gap-1.5 font-mono text-[13px] text-ink-soft hover:text-azul">
          <RotateCcw className="size-3.5" /> Enviar otro pedido
        </button>
      </div>
    </motion.div>
  );
}

function ErrorBanner({ kind, message, values, whatsappNumber }: { kind: "campos" | "envio" | "limite"; message: string; values: Record<string, string>; whatsappNumber: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    ref.current?.focus({ preventScroll: true });
  }, [message]);
  const grave = kind !== "campos";
  return (
    <div
      ref={ref}
      id="form-error"
      role="alert"
      tabIndex={-1}
      className={cn(
        "flex gap-3 rounded-[16px] px-4 py-3.5 outline-none",
        grave ? "bg-[#FBF3F0] ring-1 ring-inset ring-[#E9C8BD]" : "bg-[#FBF3F0]",
      )}
    >
      <AlertTriangle className="mt-0.5 size-5 shrink-0 text-[#B04A30]" aria-hidden />
      <div className="grid gap-2">
        <p className="text-[14px] leading-snug text-[#7A2E1B]">
          {grave && <strong className="block font-semibold">No pudimos enviar tu pedido.</strong>}
          {message}
        </p>
        {grave && (
          <a
            href={pedidoPorWhatsApp(whatsappNumber, values)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 w-fit items-center gap-2 rounded-full bg-azul px-4 text-[14px] font-medium text-white hover:bg-azul-d"
          >
            <WhatsAppIcon className="size-4" /> Mandar el pedido por WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}

function QuoteFormInner({ whatsappNumber, onReset }: { whatsappNumber: string; onReset: () => void }) {
  const [state, action] = useActionState(enviarPresupuesto, initial);
  // en la vista previa del panel el formulario se ve igual pero no envía nada
  const preview = usePreviewMode();
  const fe = state.status === "error" ? state.fieldErrors ?? {} : {};
  const v = state.status === "error" ? state.values ?? {} : {};

  if (state.status === "success") {
    return <SuccessPanel nombre={state.nombre} contacto={state.contacto} conEmail={state.conEmail} whatsappNumber={whatsappNumber} onReset={onReset} />;
  }

  return (
    <form
      action={preview ? undefined : action}
      onSubmit={preview ? (e) => e.preventDefault() : undefined}
      noValidate
      className="grid gap-4"
      aria-describedby={state.status === "error" ? "form-error" : undefined}
    >
      {state.status === "error" && <ErrorBanner kind={state.kind} message={state.message} values={state.values ?? {}} whatsappNumber={whatsappNumber} />}

      <div className="grid gap-x-4 gap-y-3.5 sm:grid-cols-2">
        <div>
          <Label htmlFor="nombre">Nombre y apellido</Label>
          <input id="nombre" name="nombre" required autoComplete="name" placeholder="Ej: Juan Pérez" defaultValue={v.nombre} aria-invalid={!!fe.nombre} aria-describedby="e-nombre" className={field} />
          <FieldError id="e-nombre" msg={fe.nombre} />
        </div>
        <div>
          <Label htmlFor="telefono">Teléfono / WhatsApp</Label>
          <input id="telefono" name="telefono" type="tel" required inputMode="tel" autoComplete="tel" placeholder="Ej: 3462" defaultValue={v.telefono} aria-invalid={!!fe.telefono} aria-describedby="e-telefono" className={field} />
          <FieldError id="e-telefono" msg={fe.telefono} />
        </div>
        <div>
          <Label htmlFor="email" optional>Email</Label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="Ej: juan@gmail.com" defaultValue={v.email} aria-invalid={!!fe.email} aria-describedby="e-email" className={field} />
          <FieldError id="e-email" msg={fe.email} />
        </div>
        <div>
          <Label htmlFor="localidad" optional>Localidad</Label>
          <input id="localidad" name="localidad" autoComplete="address-level2" placeholder="Venado Tuerto" defaultValue={v.localidad} className={field} />
        </div>
      </div>

      <fieldset>
        <legend className="mb-1.5 text-[13.5px] font-medium text-grafito">¿Qué necesitás?</legend>
        <div className="flex flex-wrap gap-2">
          {SERVICIOS.map((s, i) => (
            <label key={s.value} className="cursor-pointer">
              <input type="radio" name="servicio" value={s.value} required defaultChecked={v.servicio ? v.servicio === s.value : i === 0} className="peer sr-only" />
              <span className="inline-flex h-9 items-center rounded-full border border-line-2 bg-white px-3.5 text-[13.5px] text-grafito transition-colors peer-checked:border-azul peer-checked:bg-azul peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-azul-2">
                {s.label}
              </span>
            </label>
          ))}
        </div>
        <FieldError id="e-servicio" msg={fe.servicio} />
      </fieldset>

      <div>
        <Label htmlFor="mensaje">Contanos el trabajo</Label>
        <textarea id="mensaje" name="mensaje" required rows={3} minLength={10} placeholder="Qué querés hacer, para cuándo, si hay que retirar algo existente…" defaultValue={v.mensaje} aria-invalid={!!fe.mensaje} aria-describedby="e-mensaje" className={cn(field, "h-auto py-2.5 leading-relaxed")} />
        <FieldError id="e-mensaje" msg={fe.mensaje} />
      </div>

      <div className="grid gap-x-4 gap-y-3.5 sm:grid-cols-2">
        <div>
          <Label htmlFor="medidas" optional>Medidas aproximadas</Label>
          <input id="medidas" name="medidas" placeholder="Ej. 3,20 × 2,10 m · 120 m²" defaultValue={v.medidas} className={cn(field, "font-mono text-[14px]")} />
        </div>
        <fieldset>
          <legend className="mb-1 text-[13.5px] font-medium text-grafito">Preferís que te contactemos por</legend>
          <div className="flex h-11 rounded-[14px] border border-line-2 bg-page/60 p-1">
            {CONTACTO.map((c, i) => (
              <label key={c.value} className="flex-1 cursor-pointer">
                <input type="radio" name="contacto" value={c.value} defaultChecked={v.contacto ? v.contacto === c.value : i === 0} className="peer sr-only" />
                <span className="grid h-full place-items-center rounded-[10px] text-[13.5px] text-ink-soft transition-colors peer-checked:bg-white peer-checked:font-medium peer-checked:text-azul peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-azul-2">
                  {c.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {/* honeypot anti-spam: invisible para personas */}
      <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="sitio_web">Sitio web</label>
        <input id="sitio_web" name="sitio_web" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col items-start gap-4 pt-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-[13px] leading-snug text-ink-soft">Usamos tus datos solo para responderte este pedido.</p>
        <Submit />
      </div>
    </form>
  );
}
