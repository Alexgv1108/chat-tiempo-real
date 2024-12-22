import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'


const manifestForPlugIn = {
  registerType: 'autoUpdate',
  workbox: {
    runtimeCaching: [
      {
        urlPattern: /.*\.(?:js|css|html|json)/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'assets-cache',
          expiration: {
            maxEntries: 80,
            maxAgeSeconds: 86400,
          },
        },
      },
    ],
  },
  manifest: {
    name: 'Chat en tiempo real',
    short_name: 'Chat realtime',
    description: 'Chat en tiempo real usando React, vite y firebase',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone',
    orientation: 'portrait',
    start_url: ".",
    icons: [
      {
        src: 'src/assets/chat-icon.jpg',
        sizes: '360x360',
        type: 'image/png',
      }
    ],
  },
}

export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugIn)],
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
  },
})
