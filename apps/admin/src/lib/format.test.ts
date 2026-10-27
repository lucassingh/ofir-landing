import { describe, expect, it } from "vitest";
import { formatDate, formatDateTime, formatRelativeTime } from "./format";

// Estos tests asumen siteConfig.locale = "es-AR".

describe("formatDate", () => {
  it("no corre las fechas un día por la zona horaria", () => {
    expect(formatDate("2026-10-24", { day: "numeric", month: "long" })).toBe("24 de octubre");
  });
});

describe("formatDateTime", () => {
  it("muestra la hora de Argentina aunque el servidor esté en UTC", () => {
    // 20:40 UTC = 17:40 en Buenos Aires
    expect(formatDateTime("2026-10-27T20:40:00Z")).toMatch(/27 de octubre de 2026.*17:40/);
  });
});

describe("formatRelativeTime", () => {
  const now = Date.parse("2026-10-24T12:00:00Z");
  const ago = (minutes: number) => new Date(now - minutes * 60_000).toISOString();

  it("elige la unidad más grande que corresponda", () => {
    expect(formatRelativeTime(ago(5), now)).toBe("hace 5 minutos");
    expect(formatRelativeTime(ago(180), now)).toBe("hace 3 horas");
    expect(formatRelativeTime(ago(24 * 60), now)).toBe("ayer");
  });
});
