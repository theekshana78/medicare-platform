import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    // Security & Obfuscation: Disable sourcemaps in production so raw JSX code is never exposed in browser DevTools (F12)
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
  },
  esbuild: {
    // Strip console statements and debuggers from production bundles
    drop: mode === "production" ? ["console", "debugger"] : [],
  },
}));