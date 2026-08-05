import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Proxy: o browser chama /auth, /categories, etc. e o Vite
 * encaminha para o Adonis (:3333). Evita CORS no dia a dia.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '^/(auth|account|categories|transactions|dashboard|statistics)': {
        target: 'http://localhost:3333',
        changeOrigin: true,
      },
    },
  },
})
