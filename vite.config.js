import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon.ico', 'icon-512.png', 'apple-touch-icon.png', 'maskable-icon.svg*'],
      manifest: {
        name: 'M-Maidan: Smart Stadium Assistant',
        short_name: 'M-Maidan',
        description: 'Smart stadium assistant with real-time heatmaps and AI guide',
        theme_color: '#050A18',
        background_color: '#050A18',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone', 'browser'],
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable any'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        runtimeCaching: [
          {
            // Network-first for real-time heatmap data
            urlPattern: ({ url }) => url.pathname.includes('heatmap') || url.pathname.includes('api'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'heatmap-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 5 // 5 minutes
              }
            }
          },
          {
            // Stale-while-revalidate for stadium maps/assets
            urlPattern: ({ url }) => url.pathname.includes('.png') || url.pathname.includes('map'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'maps-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60 // 1 day
              }
            }
          }
        ]
      }
    })
  ]
})

