import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    proxy: {
      "/api": {
        target: "https://6153b121-6896-4629-a6e0-df4e298d9e28-00-3uiw497l4nwvf.pike.replit.dev",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
