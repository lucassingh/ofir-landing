/**
 * Cuentas con acceso al panel. No hay registro ni validación de email: para
 * sumar a alguien, se agrega acá y se hace deploy.
 *
 * La contraseña NO está en el código: todas las cuentas usan el hash de la
 * variable de entorno ADMIN_PASSWORD_HASH. Para cambiarla:
 *   npm run hash-password -- "NuevaContraseña"
 * y se pega el resultado en Vercel (proyecto del panel → Settings → Environment Variables).
 */

export type Role = "superadmin";

export type AdminUser = {
  email: string;
  /** Nombre que se muestra en el panel y queda como autor de cada cambio. */
  name: string;
  role: Role;
};

export const roleLabels: Record<Role, string> = {
  superadmin: "Superadmin",
};

export const users: AdminUser[] = [
  { email: "ofirsolucionesintegrales@gmail.com", name: "OFIR", role: "superadmin" },
  { email: "andresrog95@gmail.com", name: "Andrés", role: "superadmin" },
];

export function findUser(email: string) {
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email === normalized);
}
