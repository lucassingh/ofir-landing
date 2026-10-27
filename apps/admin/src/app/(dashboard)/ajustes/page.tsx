import { PageBody, PageHeader } from "@/components/layout/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSelector } from "@/components/views/theme-selector";
import { siteConfig } from "@/config/site";
import { roleLabels, users } from "@/config/users";
import { isStoreConfigured } from "@ofir/content/store";
import { requireUser } from "@/lib/auth";
import { getRouteMetadata } from "@/lib/navigation";

export const metadata = getRouteMetadata("/ajustes");

export default async function SettingsPage() {
  const me = await requireUser();

  const checks = [
    {
      label: "Almacenamiento (Vercel Blob)",
      ok: isStoreConfigured(),
      detail: "Guarda los textos y las fotos. Variable BLOB_READ_WRITE_TOKEN.",
    },
    {
      label: "Aviso a la web",
      ok: Boolean(process.env.REVALIDATE_SECRET),
      detail: "Hace que los cambios se vean al instante. Variable REVALIDATE_SECRET (igual en la web y en el panel).",
    },
    {
      label: "Contraseña del panel",
      ok: Boolean(process.env.ADMIN_PASSWORD_HASH),
      detail: "Variable ADMIN_PASSWORD_HASH (se genera con npm run hash-password).",
    },
  ];

  return (
    <>
      <PageHeader eyebrow="Configuración" title="Ajustes" description="Apariencia del panel, cuentas con acceso y estado de las conexiones." />
      <PageBody>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Apariencia</CardTitle>
              <CardDescription>Elegí cómo se ve el panel en este dispositivo.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <ThemeSelector />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Cuentas con acceso</CardTitle>
              <CardDescription>
                Todas comparten la misma contraseña. Para sumar una cuenta se agrega en{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">apps/admin/src/config/users.ts</code>.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-3">
            <ul className="divide-y divide-border">
              {users.map((user) => (
                <li key={user.email} className="flex items-center gap-3 py-3">
                  <Avatar name={user.name} className="size-9" />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-sm font-medium">
                      {user.name}
                      {user.email === me.email && <span className="text-xs font-normal text-muted-foreground">(vos)</span>}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge variant="accent">{roleLabels[user.role]}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Conexiones</CardTitle>
              <CardDescription>
                La web que se edita es{" "}
                <a href={siteConfig.siteUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline underline-offset-4">
                  {siteConfig.siteUrl.replace(/^https?:\/\//, "")}
                </a>
                .
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-3">
            <ul className="divide-y divide-border">
              {checks.map((check) => (
                <li key={check.label} className="flex items-start justify-between gap-4 py-3">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{check.label}</p>
                    <p className="text-xs text-muted-foreground">{check.detail}</p>
                  </div>
                  <Badge variant={check.ok ? "success" : "warning"} dot className="mt-0.5">
                    {check.ok ? "Listo" : "Falta configurar"}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </PageBody>
    </>
  );
}
