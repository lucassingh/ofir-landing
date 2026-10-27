// @vitest-environment node
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("password", () => {
  it("verifica la contraseña correcta y rechaza las demás", async () => {
    const hash = await hashPassword("Admin123456!");
    expect(hash).toMatch(/^scrypt:[\w-]+:[\w-]+$/);
    await expect(verifyPassword("Admin123456!", hash)).resolves.toBe(true);
    await expect(verifyPassword("admin123456!", hash)).resolves.toBe(false);
    await expect(verifyPassword("", hash)).resolves.toBe(false);
  });

  it("no acepta hashes mal formados", async () => {
    await expect(verifyPassword("x", "")).resolves.toBe(false);
    await expect(verifyPassword("x", "bcrypt:abc:def")).resolves.toBe(false);
  });

  it("acepta el hash que genera scripts/hash-password.mjs", async () => {
    const script = join(process.cwd(), "scripts", "hash-password.mjs");
    const hash = execFileSync(process.execPath, [script, "OtraClave2026!"], { encoding: "utf8" }).trim();
    await expect(verifyPassword("OtraClave2026!", hash)).resolves.toBe(true);
  });
});
