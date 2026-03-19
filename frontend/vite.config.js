import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // during development we proxy /api requests to the backend server running on port 5000
  server: {
    proxy: {
      "/api": {
          target: "https://your-render-backend-url.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

