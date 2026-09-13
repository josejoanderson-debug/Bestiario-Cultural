import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root,
  envDir: root,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(root, "client", "src"),
      "@shared": path.resolve(root, "shared"),
    },
  },
  publicDir: path.resolve(root, "client", "public"),
  build: {
    outDir: path.resolve(root, "dist", "public"),
    emptyOutDir: true,
  },
  server: { host: "0.0.0.0", port: 3000 },
});
