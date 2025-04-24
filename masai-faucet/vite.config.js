import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      protocol: 'ws', // Use WebSocket protocol
      host: 'localhost', // Ensure it connects to localhost
      port: 5173, // The port Vite is running on
    },
  },
})
