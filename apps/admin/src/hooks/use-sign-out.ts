"use client";

import { useCallback, useTransition } from "react";
import { logout } from "@/lib/auth-actions";
import { toast } from "@/lib/toast";

export function useSignOut() {
  const [pending, startTransition] = useTransition();

  const handleSignOut = useCallback(() => {
    startTransition(async () => {
      // logout() redirige a /login; el aviso queda visible porque el Toaster vive en el root layout.
      toast.success("Cerraste sesión", { description: "Te esperamos de vuelta." });
      await logout();
    });
  }, []);

  return { signOut: handleSignOut, pending };
}
