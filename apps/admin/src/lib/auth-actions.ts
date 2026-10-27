"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { findUser } from "@/config/users";
import { verifyPassword } from "@/lib/password";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

export type LoginState = { error?: string; email?: string };

// Límite simple de intentos por IP (en memoria: en serverless es por instancia,
// alcanza para frenar a alguien probando contraseñas a mano).
const attempts = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function tooManyAttempts(ip: string) {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);
  return recent.length > MAX_ATTEMPTS;
}

/** Solo rutas internas del panel (evita redirigir a otro sitio con ?next=). */
function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/login") ? next : "/";
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!passwordHash || (!process.env.AUTH_SECRET && process.env.NODE_ENV === "production")) {
    return { email, error: "El panel todavía no está configurado (faltan ADMIN_PASSWORD_HASH o AUTH_SECRET)." };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (tooManyAttempts(ip)) {
    return { email, error: "Demasiados intentos seguidos. Esperá unos minutos y probá de nuevo." };
  }

  const user = findUser(email);
  // La contraseña se verifica siempre, exista o no el email: tarda lo mismo y no revela qué cuentas hay.
  const passwordOk = await verifyPassword(password, passwordHash);
  if (!user || !passwordOk) {
    return { email, error: "El email o la contraseña no son correctos." };
  }

  (await cookies()).set(SESSION_COOKIE, await createSessionToken(user.email), sessionCookieOptions);
  redirect(safeNext(formData.get("next")));
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
