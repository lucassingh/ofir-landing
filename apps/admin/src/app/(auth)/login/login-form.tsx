"use client";

import { CircleAlert, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { login, type LoginState } from "@/lib/auth-actions";

const initialState: LoginState = {};

/** Sin `next`, lo toma de la URL (?next=/contenido/hero). */
export function LoginForm({ next }: { next?: string }) {
  return next !== undefined ? <Form next={next} /> : <FormWithSearchParams />;
}

function FormWithSearchParams() {
  return <Form next={useSearchParams().get("next") ?? "/"} />;
}

function Form({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="space-y-5" aria-describedby={state.error ? "login-error" : undefined}>
      <input type="hidden" name="next" value={next} />

      {state.error && (
        <div
          id="login-error"
          role="alert"
          className="flex animate-pop-in items-start gap-2.5 rounded-lg border border-danger/25 bg-danger/8 px-3.5 py-3 text-[13px] leading-snug text-foreground"
        >
          <CircleAlert aria-hidden className="mt-px size-4 shrink-0 text-danger" />
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          inputMode="email"
          placeholder="nombre@gmail.com"
          defaultValue={state.email}
          aria-invalid={state.error ? true : undefined}
          required
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            aria-invalid={state.error ? true : undefined}
            required
            className="h-11 pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:-outline-offset-2"
          >
            {showPassword ? <EyeOff aria-hidden className="size-4" /> : <Eye aria-hidden className="size-4" />}
          </button>
        </div>
      </div>

      <Button type="submit" size="lg" className="h-11 w-full" disabled={pending}>
        {pending && <LoaderCircle aria-hidden className="animate-spin" />}
        {pending ? "Ingresando…" : "Ingresar"}
      </Button>
    </form>
  );
}
