import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const proxyTarget = (env.VITE_API_BASE || "http://localhost:5000")
    .replace(/\/+$/, "")
    .replace(/\/api$/i, "");

  return {
    plugins: [react()],
    // during development we proxy /api requests to the backend server
    server: {
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});

