import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Sættes til "<next-basePath>/dating-crm/" ved deploy, da appen bliver
  // serveret som en statisk undermappe under Aktieklubbens Next.js-site.
  base: process.env.VITE_BASE || '/dating-crm/',
  server: {
    // Honor the PORT assigned by the preview harness; fall back to 5173 locally.
    port: Number(process.env.PORT) || 5173,
    open: false,
  },
})
