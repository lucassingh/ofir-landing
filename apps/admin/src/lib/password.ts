import { randomBytes, scrypt, timingSafeEqual, type BinaryLike } from "node:crypto";

/**
 * Hash de contraseñas con scrypt (incluido en Node, sin dependencias).
 * Formato: "scrypt:<sal>:<hash>" en base64url. Usa ":" y no "$" porque Next
 * expande "$VARIABLE" dentro de los archivos .env.
 * scripts/hash-password.mjs genera el mismo formato.
 */

const KEY_LENGTH = 64;

function derive(password: string, salt: BinaryLike, length: number) {
  return new Promise<Buffer>((resolve, reject) =>
    scrypt(password.normalize("NFKC"), salt, length, (error, key) => (error ? reject(error) : resolve(key))),
  );
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await derive(password, salt, KEY_LENGTH);
  return `scrypt:${salt.toString("base64url")}:${hash.toString("base64url")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [algorithm, salt, hash] = stored.trim().split(":");
  if (algorithm !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64url");
  const actual = await derive(password, Buffer.from(salt, "base64url"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
