import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { AUDIO_RUNTIME_CACHE } from './src/lib/audioManifest';

const repositoryBase = '/everyday-malay/';

export default defineConfig({
  base: repositoryBase,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'Everyday Malay',
        short_name: 'EverydayMalay',
        description: 'Learn everyday spoken Malaysian Malay through real scenario cards.',
        theme_color: '#0f4c4a',
        background_color: '#e6f0ee',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith(`${repositoryBase}audio/`),
            handler: 'CacheFirst',
            options: {
              cacheName: AUDIO_RUNTIME_CACHE.name,
              cacheableResponse: {
                statuses: [200]
              },
              expiration: {
                maxEntries: AUDIO_RUNTIME_CACHE.maxEntries,
                maxAgeSeconds: AUDIO_RUNTIME_CACHE.maxAgeSeconds
              }
            }
          }
        ]
      }
    })
  ]
});
