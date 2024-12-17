import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@pages': '/src/pages',
      '@assets': '/src/assets',
      '@components': '/src/components',
      '@utils': '/src/utils',
      '@helpers': '/src/helpers',
      '@global': '/src/global',
      '@store': '/src/store',
    },
  }
})
