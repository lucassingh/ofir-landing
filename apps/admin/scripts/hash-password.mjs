#!/usr/bin/env node
/**
 * Genera el valor de ADMIN_PASSWORD_HASH para una contraseña.
 *
 *   npm run hash-password -- "NuevaContraseña"
 *
 * Mismo formato que src/lib/password.ts (scrypt, "scrypt:<sal>:<hash>").
 * Se pega en Vercel → proyecto del panel → Settings → Environment Variables,
 * y en .env.local para desarrollo. Después hay que volver a hacer deploy.
 */
import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];
if (!password) {
  console.error('Uso: npm run hash-password -- "NuevaContraseña"');
  process.exit(1);
}
if (password.length < 10) {
  console.warn("Aviso: usá al menos 10 caracteres.");
}

const salt = randomBytes(16);
const hash = scryptSync(password.normalize("NFKC"), salt, 64);
console.log(`scrypt:${salt.toString("base64url")}:${hash.toString("base64url")}`);
