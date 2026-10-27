// @vitest-environment node
import { SignJWT } from "jose";
import { describe, expect, it } from "vitest";
import { findUser } from "@/config/users";
import { createSessionToken, verifySessionToken } from "./session";

describe("session", () => {
  it("la cookie firmada devuelve el email", async () => {
    const token = await createSessionToken("andresrog95@gmail.com");
    await expect(verifySessionToken(token)).resolves.toBe("andresrog95@gmail.com");
  });

  it("rechaza cookies vacías, alteradas o firmadas con otra clave", async () => {
    await expect(verifySessionToken(undefined)).resolves.toBeNull();
    const token = await createSessionToken("andresrog95@gmail.com");
    await expect(verifySessionToken(`${token}x`)).resolves.toBeNull();
    const forged = await new SignJWT({ email: "ofirsolucionesintegrales@gmail.com" })
      .setProtectedHeader({ alg: "HS256" })
      .sign(new TextEncoder().encode("otra-clave-cualquiera-de-32-caracteres"));
    await expect(verifySessionToken(forged)).resolves.toBeNull();
  });
});

describe("config/users", () => {
  it("las dos cuentas son superadmin y el email no distingue mayúsculas", () => {
    expect(findUser("OfirSolucionesIntegrales@gmail.com ")?.role).toBe("superadmin");
    expect(findUser("andresrog95@gmail.com")?.role).toBe("superadmin");
    expect(findUser("otra@gmail.com")).toBeUndefined();
  });
});
