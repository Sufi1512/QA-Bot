import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://f1ce-103-123-226-98.ngrok-free.app",
        changeOrigin: true,
      },
      "/client-updates": {
        target: "ws://f1ce-103-123-226-98.ngrok-free.app",
        ws: true,
      },
    },
  },
});