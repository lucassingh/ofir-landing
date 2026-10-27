import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { findUser, type AdminUser } from "@/config/users";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

/**
 * Usuario de la sesión actual (o null). Además de validar la firma, verifica
 * que la cuenta siga en config/users.ts: si se la saca de ahí, pierde el acceso.
 * `cache` evita verificar la cookie más de una vez por request.
 */
export const getCurrentUser = cache(async (): Promise<AdminUser | null> => {
  const store = await cookies();
  const email = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  return email ? (findUser(email) ?? null) : null;
});

/** Para las páginas del panel: sin sesión, al login. */
export async function requireUser(): Promise<AdminUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export const SESSION_EXPIRED_MESSAGE =
  "Tu sesión venció. Abrí el panel en otra pestaña, ingresá de nuevo y volvé a guardar acá: no se pierde lo que escribiste.";
