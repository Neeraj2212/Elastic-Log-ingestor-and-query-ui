import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5000,
    proxy: {
      "/api":
        process.env?.ENV === "production"
          ? "http://ingestor_server_prod:3000"
          : "http://ingestor_server:3000",
    },
  },
});
