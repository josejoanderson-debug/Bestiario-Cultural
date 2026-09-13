import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const clientRoot = path.resolve(projectRoot, "client");

export default defineConfig({
  root: clientRoot,
  envDir: projectRoot,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(clientRoot, "src"),
      "@shared": path.resolve(projectRoot, "shared"),
    },
  },
  publicDir: path.resolve(clientRoot, "public"),
  build: {
    outDir: path.resolve(projectRoot, "dist", "public"),
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});
