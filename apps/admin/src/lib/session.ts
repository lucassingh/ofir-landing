import { SignJWT, jwtVerify } from "jose";

/**
 * Sesión en una cookie firmada (JWT HS256 con AUTH_SECRET). Sin base de datos:
 * la cookie dice quién es y la firma garantiza que nadie la fabricó.
 * No usa next/headers para poder correr también en el proxy.
 */

export const SESSION_COOKIE = "ofir_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 días

const DEV_SECRET = "solo-para-desarrollo-local-no-usar-en-produccion";

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("Falta AUTH_SECRET en las variables de entorno.");
  }
  return new TextEncoder().encode(secret || DEV_SECRET);
}

export function createSessionToken(email: string) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());
}

/** Email de la sesión, o null si no hay cookie, venció, la firma no coincide o falta AUTH_SECRET. */
export async function verifySessionToken(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    return typeof payload.email === "string" ? payload.email : null;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: SESSION_MAX_AGE,
} as const;
