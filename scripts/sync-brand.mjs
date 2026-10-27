#!/usr/bin/env node
/**
 * sync-brand — trae la marca y las fotos desde su fuente única.
 *
 *   ofir-workspace/branding/                 → logos, tokens de color, tipografías web
 *   ofir-workspace/ofir-web/assets-proyectos → fotos reales de obras
 *
 * Copia a:
 *   src/brand/        (tokens CSS, fuentes para next/font/local, SVG de logos)
 *   public/brand/     (logos para <img>, OG, etc.)
 *   public/proyectos/ (fotos de obras publicables: las demás no suben al deploy)
 *   src/app/icon.svg  (favicon = símbolo blanco)
 *
 * Los archivos copiados se versionan (así el deploy en Vercel no depende de las
 * carpetas hermanas), pero NO se editan a mano: se cambian en branding/ y se
 * vuelve a correr `npm run sync:brand`.
 *
 * Si la carpeta branding no está (por ejemplo en CI), el script avisa y no falla.
 */
import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WORKSPACE = path.resolve(process.env.OFIR_WORKSPACE ?? path.join(ROOT, "..", ".."));
const BRANDING = path.join(WORKSPACE, "branding");
const ASSETS = path.join(WORKSPACE, "ofir-web", "assets-proyectos");

const LOGOS = [
  "ofir_horizontal_color.svg",
  "ofir_horizontal_negativo.svg",
  "ofir_horizontal-slogan_color.svg",
  "ofir_horizontal-slogan_negativo.svg",
  "ofir_simbolo_color.svg",
  "ofir_simbolo_negativo.svg",
];

const tipDir = ["tipografía", "tipografia"].map((d) => path.join(BRANDING, d)).find(existsSync);

async function copy(src, dst) {
  await mkdir(path.dirname(dst), { recursive: true });
  await cp(src, dst, { recursive: true, force: true });
  console.log("  ✓", path.relative(ROOT, dst));
}

async function main() {
  if (!existsSync(BRANDING)) {
    console.warn(`[sync-brand] No encuentro ${BRANDING}. Se usan los archivos ya versionados.`);
    return;
  }
  console.log(`[sync-brand] marca desde ${BRANDING}`);

  // tokens
  await copy(path.join(BRANDING, "tokens", "ofir-tokens.css"), path.join(ROOT, "src", "brand", "ofir-tokens.css"));

  // logos
  for (const f of LOGOS) {
    const src = path.join(BRANDING, "logo", "svg", f);
    if (!existsSync(src)) continue;
    await copy(src, path.join(ROOT, "public", "brand", f));
  }
  // favicon: símbolo blanco total (pedido de Lucas). Se ve sobre pestañas oscuras.
  await copy(path.join(BRANDING, "logo", "svg", "ofir_simbolo_mono-blanco.svg"), path.join(ROOT, "src", "app", "icon.svg"));

  // tipografías web (woff2 generadas desde las familias del manual)
  if (tipDir && existsSync(path.join(tipDir, "web"))) {
    for (const f of await readdir(path.join(tipDir, "web"))) {
      if (f.endsWith(".woff2")) await copy(path.join(tipDir, "web", f), path.join(ROOT, "src", "brand", "fonts", f));
    }
  } else {
    console.warn("[sync-brand] Falta branding/tipografía/web/*.woff2");
  }

  // fotos de obras
  // Solo se copian a public/ las obras que se publican (publicable: true en src/content/projects.ts)
  // y las carpetas que el código usa directo (/proyectos/<carpeta>/... en src). Lo demás no sube al deploy.
  if (existsSync(ASSETS)) {
    const projectsTs = await readFile(path.join(ROOT, "src", "content", "projects.ts"), "utf8");
    const publicable = new Map(
      [...projectsTs.matchAll(/slug:\s*"([^"]+)"[^\n]*?publicable:\s*(true|false)/g)].map((m) => [m[1], m[2] === "true"]),
    );
    const srcText = await readAll(path.join(ROOT, "src"));
    const usada = (obra) => publicable.get(obra) === true || srcText.includes(`/proyectos/${obra}/`);

    const index = {};
    for (const obra of await readdir(ASSETS)) {
      const dir = path.join(ASSETS, obra);
      if (!(await stat(dir)).isDirectory()) continue;
      const fotos = (await readdir(dir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
      index[obra] = fotos; // el índice lista todo (los textos de projects.ts lo usan como tipo)
      const dst = path.join(ROOT, "public", "proyectos", obra);
      if (!usada(obra)) {
        if (existsSync(dst)) {
          await rm(dst, { recursive: true, force: true });
          console.log("  ✗ public/proyectos/" + obra + " (no publicable, se quita)");
        }
        continue;
      }
      for (const f of fotos) await copy(path.join(dir, f), path.join(dst, f));
    }
    await writeFile(
      path.join(ROOT, "src", "content", "fotos.generated.json"),
      JSON.stringify(index, null, 2) + "\n",
    );
    console.log("  ✓ src/content/fotos.generated.json");
  }
}

async function readAll(dir) {
  let out = "";
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out += await readAll(p);
    else if (/\.(tsx?|css)$/.test(e.name) && !e.name.endsWith(".generated.json")) out += await readFile(p, "utf8");
  }
  return out;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
