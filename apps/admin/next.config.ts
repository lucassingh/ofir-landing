import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Registro de secciones del CMS (packages/content): se compila con la app.
  transpilePackages: ["@ofir/content"],
  // El indicador de desarrollo de Next tapaba "Cerrar sesión" abajo a la izquierda.
  devIndicators: { position: "bottom-right" },
  turbopack: {
    // Raíz del monorepo: ahí están node_modules y packages/.
    root: path.join(__dirname, "../.."),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
