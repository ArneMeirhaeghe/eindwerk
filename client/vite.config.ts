// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",   // maakt dat "@/api/tours" → "src/api/tours/index.ts"
    },
  },
});
