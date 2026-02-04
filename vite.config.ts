import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/green-turkiye/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    allowedHosts: ['.ngrok-free.app']
  },
})
