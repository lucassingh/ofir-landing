import { NextResponse, type NextRequest } from "next/server";
import { findUser } from "@/config/users";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

/**
 * Todo el panel requiere sesión, salvo /login.
 *
 * Las Server Actions (POST con header Next-Action) pasan: cada una verifica la
 * sesión por su cuenta y, si venció, devuelve un error en vez de redirigir (así
 * no se pierde lo que se estaba editando). Como ese header se puede falsificar,
 * cada página del panel también exige sesión (`requireUser`): el proxy no es la
 * única barrera.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (request.method === "POST" && request.headers.has("next-action")) return NextResponse.next();

  const email = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  const signedIn = email !== null && findUser(email) !== undefined;

  if (pathname === "/login") {
    return signedIn ? NextResponse.redirect(new URL("/", request.url)) : NextResponse.next();
  }
  if (signedIn) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Tu sesión venció. Volvé a ingresar." }, { status: 401 });
  }
  const login = new URL("/login", request.url);
  if (pathname !== "/") login.searchParams.set("next", pathname + search);
  return NextResponse.redirect(login);
}

export const config = {
  // Todo menos los archivos estáticos (logos, textura, favicon).
  matcher: ["/((?!_next/static|_next/image|brand/|texturas/|icon.svg|favicon.ico).*)"],
};
