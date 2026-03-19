import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // during development we proxy /api requests to the backend server running on port 5000
  server: {
    proxy: {
      "/api": {
        // Use environment variable for backend URL
        target: process.env.VITE_API_BASE || "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

