import { ExternalLink } from "lucide-react";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SidebarTrigger } from "@/components/layout/sidebar-trigger";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";
import { roleLabels } from "@/config/users";
import { getCurrentUser } from "@/lib/auth";

/** La sesión se lee en el request: el resto de la barra queda estática. */
async function CurrentUserMenu() {
  const user = await getCurrentUser();
  if (!user) return null;
  return <UserMenu user={{ name: user.name, email: user.email, role: roleLabels[user.role] }} />;
}

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-surface px-3 sm:px-4">
      <SidebarTrigger />
      <span aria-hidden className="mx-1 h-5 w-px bg-border" />
      <Breadcrumbs />

      <div className="ml-auto flex items-center gap-1">
        {/* En celular queda solo el ícono */}
        <Button variant="outline" size="sm" asChild className="mr-1 max-sm:size-8 max-sm:px-0">
          <a href={siteConfig.siteUrl} target="_blank" rel="noopener noreferrer">
            <span className="max-sm:sr-only">Ver la web</span>
            <ExternalLink aria-hidden />
            <span className="sr-only">(se abre en otra pestaña)</span>
          </a>
        </Button>
        <ThemeToggle />
        <span aria-hidden className="mx-2 h-5 w-px bg-border" />
        <Suspense fallback={<Skeleton className="size-8 rounded-full" />}>
          <CurrentUserMenu />
        </Suspense>
      </div>
    </header>
  );
}
