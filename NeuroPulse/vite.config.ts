import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The browser calls /api/predict; Vite forwards it to FastAPI's /predict.
// No backend changes or CORS configuration are needed in development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://neuropulse-xvjv.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
