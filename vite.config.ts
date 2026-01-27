import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'PhishMonger',
        short_name: 'PhishMonger',
        description: 'Annotate phishing emails with technique explanations and generate visual training materials',
        theme_color: '#2563eb',
        background_color: '#f3f4f6',
        icons: [
          {
            src: '/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: '/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}']
      }
    }),
    viteSingleFile()
  ],
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: 100000000
  }
})
