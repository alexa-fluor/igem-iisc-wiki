import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";

/*
 * iGEM only serves images from static.igem.wiki, and the uploads tool renames
 * every file: lower-cased, "_" and "__" become "-", extension becomes .avif.
 * When IGEM_STATIC_BASE is set, every raster image under src/assets/<dir>/ or
 * assets/ resolves to <base><dir>-<name>.avif instead of being bundled.
 */
function staticImages(base: string): Plugin {
  const re = /\/(?:src\/)?assets\/(?:([^/]+)\/)?([^/]+)\.(?:png|jpe?g|webp|gif)$/i;
  return {
    name: "igem-static-images",
    enforce: "pre",
    load(id) {
      const m = re.exec(id.split("?")[0]);
      if (!m) return null;
      const dir = !m[1] || m[1] === "assets" ? "site" : m[1];
      const name = `${dir}-${m[2]}`.toLowerCase().replace(/_/g, "-");
      return `export default ${JSON.stringify(`${base}${name}.avif`)};`;
    },
  };
}

/*
 * iGEM serves every team wiki from a sub-path: https://2026.igem.wiki/<team>/.
 * `base` must match that sub-path or every built asset URL 404s on the live wiki.
 * Keep it as "/" for local `npm run dev`, and set IGEM_BASE when building for iGEM:
 *   IGEM_BASE=/iisc-bengaluru/ npm run build
 */
export default defineConfig(({ mode }) => {
  // loadEnv reads IGEM_* from the shell as well as from a .env file, and
  // avoids needing Node's types in a browser-facing project.
  const env = loadEnv(mode, process.cwd(), "IGEM");
  return {
    base: env.IGEM_BASE || "/",
    plugins: [...(env.IGEM_STATIC_BASE ? [staticImages(env.IGEM_STATIC_BASE)] : []), react()],
    build: {
      outDir: "dist",
      // One chunk per page keeps the first paint small; the pages are large files.
      chunkSizeWarningLimit: 1200,
    },
  };
});
