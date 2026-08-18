import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),

    tanstackStart({
      srcDirectory: "src",
      router: {
        routesDirectory: "routes",
      },
      prerender: {
        enabled: false,
      },
    }),

    nitro({
      preset: "vercel",
    }),

    viteReact(),
  ],

  resolve: {
    tsconfigPaths: true,
  },

  server: {
    port: 5173,
    host: true,
  },

  build: {
    sourcemap: false,
  },
});