import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // Confirma que o build será gerado no diretório 'dist'
  },
  server: {
    proxy: {
      "/api": "http://localhost:3000", // Caso queira testes locais com o backend
    },
  },
});
