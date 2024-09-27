import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0", // Faz o Vite escutar em todas as interfaces
    port: process.env.PORT || 5173, // Usa a variável de ambiente PORT ou o padrão 5173
  },
});
