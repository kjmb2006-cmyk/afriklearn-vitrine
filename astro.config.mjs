// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// Config de référence pour le Sprint 1.
// site : à remplacer par le domaine définitif une fois le DNS pointé (voir docs/dor-sprint-1.md)
export default defineConfig({
  site: "https://afriklearn-consulting.com",
  output: "static", // build 100% statique — servi par Nginx sur le VPS existant, voir CLAUDE.md §3
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    assets: "assets",
  },
});
